from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Max,Sum,Min
from rest_framework.permissions import IsAuthenticated
from meal.models import Meal,Food
from exercise.models import Exercise,Workout
from django.db.models import F,FloatField, Value,Case, When
from django.db.models.functions import Coalesce
from graph.helpers.calc_daily_bm_cals import calc_daily_bm_cals
from graph.helpers.calc_daily_exercise_cals import calc_daily_exercise_cals
from graph.helpers.calc_daily_meal_cals import calc_daily_meal_cals



# 各日付における、exercise,mealが入力されてるかどうかをリストにして返す
class RegistrationStatusCheckView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        registration_status = []

        # account に関連する exercise と meal データを取得
        user = self.request.user
        exercises = Exercise.objects.filter(account=user.id)
        meals = Meal.objects.filter(account=user.id)
        
        # # 最新の meal_date と exercise_date を取得
        latest_meal_date = meals.aggregate(latest_date=Max('meal_date'))['latest_date']
        latest_exercise_date = exercises.aggregate(latest_date=Max('exercise_date'))['latest_date']

        # meal_date および exercise_date が None の場合は現在の日付を使用
        latest_meal_date = latest_meal_date or timezone.now().date()
        latest_exercise_date = latest_exercise_date or timezone.now().date()
        
        # 最も古い運動日付
        oldest_exercise_date = Exercise.objects.filter(account=user.id).aggregate(Min('exercise_date'))['exercise_date__min']

        # 最も古い食事日付
        oldest_meal_date = Meal.objects.filter(account=user.id).aggregate(Min('meal_date'))['meal_date__min']

        print("oldest_exercise_date:", oldest_exercise_date)
        print("oldest_meal_date:", oldest_meal_date)
        # 最も古い日付
        # oldest_date = min(
        #     oldest_exercise_date,
        #     oldest_meal_date,
        #     (user.date_joined.date() if user.date_joined else None),
        #     default=timezone.now().date()  # バックアップのデフォルト値
        # )
        
        oldest_date = min(
            filter(None, [oldest_exercise_date, oldest_meal_date, user.date_joined.date() if user.date_joined else None]),
            default=timezone.now().date()  # バックアップのデフォルト値
        )
        
        print("oldest_date:", oldest_date)
        
        # account 作成日から今日までの日付リストを取得
        latest_date = max(latest_meal_date, latest_exercise_date, timezone.now().date())
        date_list = [oldest_date + timezone.timedelta(days=x) for x in range((latest_date - oldest_date).days + 1)]

        for date in date_list:
            status_entry = {
                'date': date,
                'meal': meals.filter(meal_date=date).exists(),
                'exercise': exercises.filter(exercise_date=date).exists(),
            }
            registration_status.append(status_entry)

        return Response(registration_status)
    
    
    
    
    
    
    
    
    
    
    
    
# 指定した日の摂取カロリー、消費カロリーを取得
class CalsByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user
        
        # フロントエンドから指定された日付
        date =  request.query_params.get('date', None)
        
        # Calculate total intake calories for each date
        intake_cals = calc_daily_meal_cals(user,date)
        # consuming calories 1 (bm cals)
        bm_cals = calc_daily_bm_cals(user, date)
        # consuming calories 2 (exercise cals)
        exercise_cals = calc_daily_exercise_cals(user, date)
        # consuming calories 3 (food cals)
        food_cals = 0.1*intake_cals
        

        return Response({'intake_cals':intake_cals,'bm_cals':bm_cals,'exercise_cals':exercise_cals,'food_cals':food_cals}, status=status.HTTP_200_OK)




# 指定した日のPFCを取得
class PFCSumByDateView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = self.request.user
        
        # クエリパラメータから日付を取得する。デフォルトは今日の日付。
        date = self.request.query_params.get('date', timezone.now().date())

        # 指定された日付に対応する meal を取得
        meals = Meal.objects.filter(account=user.id,meal_date=date)
        
        # 各栄養素のフィールド名リスト
        pfc_fields = ['carbohydrate', 'fat', 'protein']
        
        # 各栄養素の総摂取量の計算
        total_amount = [{'nutrient': nutrient, 'amount': meals.values().aggregate(
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
            ['total_nutrient']} for nutrient in pfc_fields]


        return Response(total_amount, status=status.HTTP_200_OK)