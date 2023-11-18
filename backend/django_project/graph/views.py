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

        # start_dateがNoneの場合、今日の日付から30日前の日付に設定
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