# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Pet
from user_info.models import UserInfo
from exercise.models import Exercise
from meal.models import Meal
from datetime import timedelta
from datetime import datetime, timedelta
from .serializers import PetSerializer
from rest_framework.permissions import IsAuthenticated


class PetView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        user = self.request.user
        pet_date_str = request.query_params.get('pet_date', None)
        # Convert pet_date_str to datetime object
        pet_date = datetime.strptime(pet_date_str, '%Y-%m-%d').date() if pet_date_str else None

        pet = Pet.objects.filter(account=user.id,pet_date=pet_date).first()
        
        if pet is not None:
            serializer = PetSerializer(instance=pet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            
            # # ここでexercise,meal,user_infoのモデル記録状況を見てペットを保存する
            exercise = Exercise.objects.filter(account=user.id)
            meal = Meal.objects.filter(account=user.id)
            user_info = UserInfo.objects.filter(account=user.id)
            
            exercise_dates = exercise.filter(account=user.id).values('exercise_date').distinct()
            meal_dates = meal.filter(account=user.id).values('meal_date').distinct()
            
            exercise_count = exercise_dates.count()
            meal_count = meal_dates.count()
            
            print('エクササイズ',exercise_count)
            print("ミール",meal_count)
                        
            grow_stage = (
                'Adult' if meal_count >= 90 and exercise_count >= 12 else
                'Child2' if meal_count >= 60 and exercise_count >= 8 else
                'Child' if meal_count >= 30 and exercise_count >= 4 else
                'Baby2' if meal_count >= 14 and exercise_count >= 2 else
                'Baby' if meal_count >= 7 and exercise_count >= 1 else
                'Egg2' if meal_count >= 3 else
                'Egg'
            )
            
            body_status = determine_pet_status(user,pet_date,user_info)
            
            # Petモデルの作成
            serializer = PetSerializer(data={
                'account': user.id,
                'grow': grow_stage,
                'body_status': body_status,
                'pet_date': pet_date
            })
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print('エラー',serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from datetime import timedelta
from helpers.calc_daily_exercise_cals import calc_daily_exercise_cals
from helpers.calc_daily_meal_cals import calc_daily_meal_cals
from helpers.calc_daily_bm_cals import calc_daily_bm_cals
from django.db.models import Sum, F, FloatField
from django.db.models.functions import Cast
from django.db.models.functions import Coalesce


NORMAL_BODY_FAT = 15  # 適切な体脂肪率の閾値(男) 女は＋10　
HIGH_BODY_FAT = 25    # やや高い体脂肪率の閾値(男) 女は+10

# Pet のbody_statusを決定する
def determine_pet_status(user, pet_date,user_info):
    # 最新の日付から10日遡る
    
    user_info = UserInfo.objects.filter(account=user.id).order_by('-date').first()
    
    meal_count_last_10_days =10
    date_list_last_10_days = [pet_date - timedelta(days=x) for x in range(10)]

    for date in date_list_last_10_days:
        intake_cals= calc_daily_meal_cals(user,date)
        bm_cals= calc_daily_bm_cals(user,date)
        # mealごとの処理を実行
        if intake_cals < bm_cals - 500: #食べる量が少ない日はcount-1
            meal_count_last_10_days -= 1
    
    print('10日の食事ちゃんと食べた日',meal_count_last_10_days)
    # 分岐1
    if meal_count_last_10_days <4: #ちゃんと食べてる日が4日未満
        return 'Thin'
    
    # 分岐2
    if meal_count_last_10_days < 7: #ちゃんと食べてる日が７日未満
        return 'Semi-Thin'

    # 分岐3
    thirty_days_ago = pet_date - timedelta(days=30)
    meal_count_last_30_days = 30
    date_list_last_30_days = [pet_date - timedelta(days=x) for x in range(30)]
    
    for date in date_list_last_30_days:
        # mealごとの処理を実行
        intake_cals= calc_daily_meal_cals(user,date)
        bm_cals= calc_daily_bm_cals(user,date)
        food_cals=intake_cals*0.1
        exercise_cals = calc_daily_exercise_cals(user,date)
        consuming_cals= bm_cals+food_cals+exercise_cals
        
        if intake_cals < consuming_cals+500: #消費カロリーが多い場合
            meal_count_last_30_days -= 1

    print('30日で摂取カロリーが消費カロリーよりも多い日',meal_count_last_30_days)
    if meal_count_last_30_days >= 20: #摂取カロリーが多い日が続く場合
        # ネスト分岐
        # 筋トレ全体の総重量を計算
        total_weight_data = Exercise.objects.filter(account=user.id, exercise_date__range=[thirty_days_ago, pet_date]).aggregate(
            total_weight=Coalesce(
                Cast(
                    Sum(
                        Cast(F('weight_kg'), FloatField()) *
                        Cast(F('sets'), FloatField()) *
                        Cast(F('reps'), FloatField()),
                        output_field=FloatField()
                    ),
                    FloatField()
                ),
                Cast(0, FloatField())
            )
        )['total_weight']
        
        if(user.sex == False): #性別が男の場合
            # 分岐4
            if total_weight_data > 100000:
                return 'Muscular'
            
            if total_weight_data >70000:
                return 'Semi-Muscular'
            
            # 分岐5
            if user_info.body_fat_percentage <= NORMAL_BODY_FAT:
                return 'Normal'
            
            # 分岐6
            if NORMAL_BODY_FAT < user_info.body_fat_percentage <= HIGH_BODY_FAT:
                return 'Semi-Fatting'

            # 分岐7
            return 'Fatting'
        
        
        else: #性別が女の場合
            # 分岐4
            if total_weight_data > 60000:
                return 'Muscular'
            
            if total_weight_data >30000:
                return 'Semi-Muscular'
            
            # 分岐5
            if user_info.body_fat_percentage <= NORMAL_BODY_FAT+10:
                return 'Normal'
            
            # 分岐6
            if NORMAL_BODY_FAT < user_info.body_fat_percentage <= HIGH_BODY_FAT+10:
                return 'Semi-Fatting'

            # 分岐7
            return 'Fatting'
        

    # 上記のどれにも当てはまらない場合
    return 'Normal'  # またはデフォルトの状態を設定
