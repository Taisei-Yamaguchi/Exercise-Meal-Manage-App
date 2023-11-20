# views.py

from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user_info.models import UserInfo
from .serializers import WeightDataSerializer,BodyFatDataSerializer,MuscleMassDataSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, datetime,date
from django.db.models import Sum,F, ExpressionWrapper, fields, IntegerField,FloatField, Value,Case, When
from django.db.models.functions import Coalesce
from django.http import JsonResponse
import json
from exercise.models import Exercise,Workout
from django.db.models.functions import Cast
from meal.models import Meal,Food
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from django.db.models import Q
from django.db.models import Min
from django.db.models import Max
from user_info.models import UserInfo
from django.db.models import Avg


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
        weight_data = list(UserInfo.objects.filter(account=request.user).values('date', 'weight'))

        
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
    





class BodyFatDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'body_fat_data': [], 'latest_body_fat_target': None}, status=status.HTTP_200_OK)

        body_fat_data = list(UserInfo.objects.filter(account=request.user).values('date', 'body_fat_percentage'))

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
        
        
        
        
        
class MuscleMassDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'muscle_mass_data': [], 'latest_muscle_mass_target': None}, status=status.HTTP_200_OK)

        muscle_mass_data = list(UserInfo.objects.filter(account=request.user).values('date', 'muscle_mass'))

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
        default_workout_weight = Exercise.objects.filter(account=request.user,default_workout__isnull=False).exclude(default_workout__isnull=True, default_workout__workout_type='Aerobic').values('default_workout__workout_type').annotate(
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
        
        print("total_weight_data:", total_weight_data)
        print("default_workout_weight:", default_workout_weight)

        #  それぞれの結果をディクショナリに格納
        total_weight_data_dict = {item['workout__workout_type']: item['total_weight'] for item in total_weight_data}
        default_workout_weight_dict = {item['default_workout__workout_type']: item['total_weight'] for item in default_workout_weight}

        # ディクショナリを結合
        result = {key: total_weight_data_dict.get(key, 0) + default_workout_weight_dict.get(key, 0) for key in set(total_weight_data_dict) | set(default_workout_weight_dict)}

        print("result:", result)
        # 結果をリストに変換
        result_list = [{'workout__workout_type': key, 'total_weight': value} for key, value in result.items()]

        # 総合計を計算
        grand_total = sum(item['total_weight'] for item in result_list)
        
        # 結果と総合計を別々に返す
        return Response({'result_list': result_list, 'grand_total': grand_total}, status=status.HTTP_200_OK)




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
                        When(serving=0, then=F('grams') * F(f'food__{nutrient}') / F('food__amount_per_serving')),
                        default=F('serving') * F(f'food__{nutrient}'),
                        output_field=FloatField()
                    )
                    
                ),Value(0, output_field=FloatField()))
    
            )
            ['total_nutrient']} for nutrient in nutrient_fields]
        
        return Response(total_nutrients, status=status.HTTP_200_OK)


class DailyExerciseWeightGraphDataAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # フロントエンドから指定されたworkout_typeと日付の範囲
        workout_type = request.query_params.get('workout_type', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', timezone.now().date())

        # start_dateがNoneの場合
        oldest_exercise_date = Exercise.objects.filter(account=request.user).aggregate(Min('exercise_date'))['exercise_date__min']
        start_date = oldest_exercise_date if oldest_exercise_date else timezone.now().date()
        
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

        for date in missing_dates:
            daily_weights = list(daily_weights)
            daily_weights.append({'exercise_date': date, 'total_weight': 0})

        # 日付でソート
        daily_weights = sorted(daily_weights, key=lambda x: x['exercise_date'])


        return Response(daily_weights)
    
    
    
    









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
                "exercise_consuming_cals": exercise_calories,
                "bm_consuming_cal": bm_calories,
                "food_consuming_cal": food_cals,
            })
        

        return Response({'intake_cals':intake_cals,'consuming_cals':consuming_cals}, status=status.HTTP_200_OK)
    
    
    
    
    
    
    
# カロリー計算　関数1
#指定した日付以前で、最新の体重
def get_user_weight_on_date(user, date):
    # 指定された日付以前の最新のweightを取得
    user_info=UserInfo.objects.filter(account=user, date__lte=date)
    if user_info.exists():
        latest_weight = user_info.aggregate(latest_weight=Max('weight')).get('latest_weight')
    else:
        # user_infoが存在しない場合は、平均値を計算
        avg_weight = UserInfo.objects.filter(account=user).aggregate(avg_weight=Avg('weight')).get('avg_weight')
        # 一度もuser_infoを登録していない場合のデフォルト値（例: 60）
        latest_weight = avg_weight if avg_weight is not None else 60
    return latest_weight



# 個別のexerciseにおける運動消費カロリーを計算する関数
# dateごとの合計の計算はまた別でやる
def calculate_exercise_calories(exercise):
    # duration_minutesがnullの場合はsetsとrepsから計算
    if exercise.duration_minutes is None:
        # 1 repあたりの時間（秒）を計算
        rep_duration = 4  
        
        # setsとrepsからトータルの運動時間（秒）を計算
        total_duration = rep_duration * exercise.sets * exercise.reps
    else:
        total_duration = exercise.duration_minutes * 60  # 分を秒に変換

    # exerciseのMetsが指定されていない場合はデフォルト値を使う
    mets = float(exercise.mets) if exercise.mets is not None else 1.0

    # exerciseの日付に対応するuser_infoのweightを取得
    user_weight = get_user_weight_on_date(exercise.account, exercise.exercise_date)
    # 運動消費カロリーの計算（MET * 体重 * 時間）
    calories = mets * user_weight * (total_duration / 3600)
    calories = calories if calories is not None else 0

    return calories


#その日の,exerciseのカロリーの合計を求める
def calc_daily_exercise_cals(user,date):
    # 指定した日付のExerciseモデルのデータを取得
    exercises = Exercise.objects.filter(account=user, exercise_date=date)
    cals=0
    for exercise in  exercises:
        cals+=calculate_exercise_calories(exercise)

    return cals



# 基礎代謝計算
def calc_daily_bm_cals(user,date):
    metabolism_info = UserInfo.objects.filter(account=user,date=date).values('metabolism').first()
    
    if metabolism_info is not None:
        return metabolism_info['metabolism']
    else:
        # 指定した日付より前の最新の基礎代謝を取得
        latest_metabolism = UserInfo.objects.filter(account=user, date__lt=date).aggregate(Max('date'))

        if latest_metabolism['date__max'] is not None:
            latest_metabolism_data = UserInfo.objects.filter(account=user, date=latest_metabolism['date__max']).first()
            return latest_metabolism_data.metabolism
        else:
            # 過去のデータも存在しない場合はデフォルトで1500を返す
            return 1500
    
# 摂取カロリー計算
# 指定した日付の食事のそうカロリーを出す。
# 全ての日付にこの関数を実行しリストに入れていく
def calc_daily_meal_cals(user, date):
    # Calculate total calories for the specified date
    total_calories = Meal.objects.filter(account=user, meal_date=date).aggregate(
        total_calories=Coalesce(
            Sum(
                    Case(
                        When(serving__isnull=True, then=F('grams') * F('food__cal') / F('food__amount_per_serving')),
                        When(serving=0, then=F('grams') * F(f'food__cal') / F('food__amount_per_serving')),
                        default=F('serving') * F(f'food__cal'),
                        output_field=FloatField()
                    )
                    
                ),Value(0, output_field=FloatField()))
    
            )['total_calories']

    return total_calories


