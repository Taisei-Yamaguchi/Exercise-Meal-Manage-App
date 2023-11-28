from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user_info.models import UserInfo
from .serializers import WeightDataSerializer,BodyFatDataSerializer,MuscleMassDataSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, date
from django.db.models import Sum,F,FloatField, Value,Case, When
from django.db.models.functions import Coalesce

from exercise.models import Exercise
from django.db.models.functions import Cast
from meal.models import Meal
from django.utils import timezone
from django.db.models import Q,CharField
from django.db.models import Min
from user_info.models import UserInfo


from .helpers.calc_daily_exercise_cals import calc_daily_exercise_cals
from .helpers.calc_daily_bm_cals import calc_daily_bm_cals
from .helpers.calc_daily_meal_cals import calc_daily_meal_cals


# weight data for creating weight graph. weightの毎日の変化を折れ線グラフにする。
# latest_target_weightをグラフに表示。グラフ作成はreactで行う。
class WeightDataAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)  # ユーザーに関連するデータを取得

        # # データがない場合の処理
        if not user_info.exists():
            return Response({'weight_data':[],'latest_target_weight':None}, status=status.HTTP_200_OK)
        # 日付、体重のデータを取得
        weight_data = list(user_info.values('date', 'weight'))
        
        # 補完用のデータを生成
        interpolated_data = []
        # 現在の日付を取得
        today = date.today()
        
        # 最初の日付から今日までの日数
        days_diff = (today - weight_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = weight_data[0]['date'] + timedelta(days=j)

            # 既にデータがある場合はスキップ
            if missing_date not in [entry['date'] for entry in weight_data]:
                interpolated_data.append({'date': missing_date, 'weight': None})

                
        # 補完データを元のデータに結合
        weight_data.extend(interpolated_data)
        
        # 日付でリストをソート
        weight_data.sort(key=lambda x: x['date'])

        # 最新の目標体重を取得
        latest_traget_weight = user_info.latest('date').target_weight

        # シリアライズしてレスポンス
        serialized_data = WeightDataSerializer(weight_data, many=True).data

        return Response({'weight_data':serialized_data,'latest_target_weight':latest_traget_weight}, status=status.HTTP_200_OK)




# body fat graph
class BodyFatDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'body_fat_data': [], 'latest_body_fat_target': None}, status=status.HTTP_200_OK)
        body_fat_data = list(user_info.values('date', 'body_fat_percentage'))

        interpolated_data = []
        today = date.today()
        days_diff = (today - body_fat_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = body_fat_data[0]['date'] + timedelta(days=j)
            if missing_date not in [entry['date'] for entry in body_fat_data]:
                interpolated_data.append({'date': missing_date, 'body_fat_percentage': None})

        body_fat_data.extend(interpolated_data)
        body_fat_data.sort(key=lambda x: x['date'])

        #　ここで最新のbody_fatの目標を取得
        latest_body_fat_target = user_info.latest('date').target_body_fat_percentage

        serialized_data = BodyFatDataSerializer(body_fat_data, many=True).data

        return Response({'body_fat_data': serialized_data, 'latest_body_fat_target': latest_body_fat_target},
                        status=status.HTTP_200_OK)




# muscle mass graph
class MuscleMassDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'muscle_mass_data': [], 'latest_muscle_mass_target': None}, status=status.HTTP_200_OK)

        muscle_mass_data = list(user_info.values('date', 'muscle_mass'))

        interpolated_data = []
        today = date.today()
        days_diff = (today - muscle_mass_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = muscle_mass_data[0]['date'] + timedelta(days=j)
            if missing_date not in [entry['date'] for entry in muscle_mass_data]:
                interpolated_data.append({'date': missing_date, 'muscle_mass': None})

        muscle_mass_data.extend(interpolated_data)
        muscle_mass_data.sort(key=lambda x: x['date'])

        # MuscleMassDataAPIViewではmuscle_mass_targetが存在しないためNoneとします
        latest_muscle_mass_target = user_info.latest('date').target_muscle_mass

        serialized_data = MuscleMassDataSerializer(muscle_mass_data, many=True).data

        return Response({'muscle_mass_data': serialized_data, 'latest_muscle_mass_target': latest_muscle_mass_target},
                        status=status.HTTP_200_OK)





# 筋トレ部位別 総重量グラフ
class ExerciseTotalWeightGraphDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 筋トレ部位別総重量グラフのデータを取得
        total_weight_data = Exercise.objects.filter(account=request.user,workout__isnull=False).exclude(workout__workout_type='Aerobic').values('workout__workout_type').annotate(
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
        )

        # デフォルトのワークアウトも取得
        default_workout_total_weight_data = Exercise.objects.filter(account=request.user,default_workout__isnull=False).exclude(default_workout__isnull=True, default_workout__workout_type='Aerobic').values('default_workout__workout_type').annotate(
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
        )
        
        #  それぞれの結果をディクショナリに格納
        total_weight_data_dict = {item['workout__workout_type']: item['total_weight'] for item in total_weight_data}
        default_workout_weight_data_dict = {item['default_workout__workout_type']: item['total_weight'] for item in default_workout_total_weight_data}
        # ディクショナリを結合
        result = {key: total_weight_data_dict.get(key, 0) + default_workout_weight_data_dict.get(key, 0) for key in set(total_weight_data_dict) | set(default_workout_weight_data_dict)}
        # 結果をリストに変換
        result_list = [{'workout__workout_type': key, 'total_weight': value} for key, value in result.items()]
        # 総合計を計算
        grand_total = sum(item['total_weight'] for item in result_list)
        
        # 結果と総合計を別々に返す
        return Response({'result_list': result_list, 'grand_total': grand_total}, status=status.HTTP_200_OK)



#日付別、栄養バランスグラフ
class DailyNutrientsGraphDataAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # フロントエンドから指定された日付
        selected_date =  request.query_params.get('date', None)
        # ログインユーザーに関連するmealデータの抽出
        meals = Meal.objects.filter(account=request.user, meal_date=selected_date)
        # 各栄養素のフィールド名リスト
        nutrient_fields = ['carbohydrate', 'fat', 'protein','sugars','dietary_fiber','salt','sodium','potassium','calcium','magnesium','iron','zinc','vitamin_a','vitamin_d','vitamin_e','vitamin_b1','vitamin_b2','vitamin_b12','vitamin_b6','vitamin_c','niacin','cholesterol','saturated_fat']
        
        # 各栄養素の総摂取量の計算
        total_nutrients = [{'nutrient': nutrient, 'amount': meals.values().aggregate(
            total_nutrient=Coalesce(
            Sum(
                    Case(
                        When(serving__isnull=True, then=F('grams') * F(f'food__{nutrient}') / F('food__amount_per_serving')),
                        When(serving=0,serving__isnull=False, then=F('grams') * F(f'food__{nutrient}') / F('food__amount_per_serving')),
                        default=F('serving') * F(f'food__{nutrient}'),
                        output_field=FloatField()
                    )
                    
                ),Value(0, output_field=FloatField()))
    
            )
            ['total_nutrient']} for nutrient in nutrient_fields]
        
        return Response(total_nutrients, status=status.HTTP_200_OK)




# 部位別、筋トレ重量の日々の変化
class DailyExerciseWeightGraphDataAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # フロントエンドから指定されたworkout_typeと日付の範囲
        workout_type = request.query_params.get('workout_type', None)
        
        # start_dateとend_dateの設定
        oldest_exercise_date = Exercise.objects.filter(account=request.user).aggregate(Min('exercise_date'))['exercise_date__min']
        start_date = oldest_exercise_date if oldest_exercise_date else timezone.now().date()
        end_date = timezone.now().date()
        
        # 指定されたworkout_typeに対応するexerciseデータの抽出
        if workout_type != 'All':
            exercises = Exercise.objects.filter(
                Q(account=request.user, workout__workout_type=workout_type, exercise_date__range=(start_date, end_date)) |
                Q(account=request.user, workout=None, default_workout__workout_type=workout_type, exercise_date__range=(start_date, end_date))
            )
        else:
            exercises = Exercise.objects.filter(
                Q(account=request.user, exercise_date__range=(start_date, end_date))
            )
            

        # 各日の合計重量の計算
        daily_weights = exercises.values('exercise_date').annotate(
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
        ).order_by('exercise_date')


        # データが存在しない日の追加
        existing_dates = set(item['exercise_date'] for item in daily_weights)
        missing_dates = set(start_date + timezone.timedelta(days=x) for x in range((end_date - start_date).days + 1)) - existing_dates

        daily_weights = list(daily_weights)
        for date in missing_dates:
            daily_weights.append({'exercise_date': date, 'total_weight': 0})

        # 日付でソート
        daily_weights = sorted(daily_weights, key=lambda x: x['exercise_date'])
        return Response(daily_weights)





# 日付別に摂取カロリー、消費カロリーを取得
class CalGraphAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', timezone.now().date())

        # start_dateがNoneの場合
        oldest_exercise_date = Exercise.objects.filter(account=user).aggregate(Min('exercise_date'))['exercise_date__min']
        oldest_meal_date= Meal.objects.filter(account=user).aggregate(Min('meal_date'))['meal_date__min']
        oldest_user_info_date= UserInfo.objects.filter(account=user).aggregate(Min('date'))['date__min']
        
        # それぞれの最古の日付を取得
        oldest_dates = [oldest_exercise_date, oldest_meal_date, oldest_user_info_date]

        # Noneでない最も古い日付をstart_dateにセット
        start_date = min(date for date in oldest_dates if date is not None) if any(oldest_dates) else timezone.now().date()
        
        
        #指定した日付全ての分のデータをとる。存在しない場合は0を返す
        dates = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        
        # Calculate total intake calories for each date
        intake_cals = []
        for date in dates:
            # Calculate total calories for the specified date
            total_calories = calc_daily_meal_cals(user,date)
            
            intake_cals.append({
                "date": date,
                "total_cal": total_calories,
                
            })
        print(intake_cals)
        
        # Calculate total consuming calories for each date
        consuming_cals = []
        for entry in intake_cals:
            date = entry["date"]
            
            bm_calories =calc_daily_bm_cals(user, date)
            exercise_calories = calc_daily_exercise_cals(user, date)
            food_cals = 0.1 * entry["total_cal"]
            
            consuming_cals.append({
                "date": date,
                "bm_consuming_cal": bm_calories,
                "exercise_consuming_cals": exercise_calories,
                "food_consuming_cal": food_cals,
            })
        

        return Response({'intake_cals':intake_cals,'consuming_cals':consuming_cals}, status=status.HTTP_200_OK)
    