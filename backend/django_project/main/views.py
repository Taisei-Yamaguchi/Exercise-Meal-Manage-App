from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Max
from meal.models import Meal,Food
from exercise.models import Exercise,Workout



# 各日付における、exercise,mealが入力されてるかどうかをリストにして返す
class RegistrationStatusCheckView(APIView):
    def get(self, request):
        registration_status = []

        # account に関連する exercise と meal データを取得
        user = self.request.user
        exercises = Exercise.objects.filter(account=user.id)
        meals = Meal.objects.filter(account=user.id)
        
        # 最新の meal_date と exercise_date を取得
        latest_meal_date = meals.aggregate(latest_date=Max('meal_date'))['latest_date']
        latest_exercise_date = exercises.aggregate(latest_date=Max('exercise_date'))['latest_date']

        # meal_date および exercise_date が None の場合は現在の日付を使用
        latest_meal_date = latest_meal_date or timezone.now().date()
        latest_exercise_date = latest_exercise_date or timezone.now().date()

        # account 作成日から今日までの日付リストを取得
        account_created_date = user.date_joined.date()
        latest_date = max(latest_meal_date, latest_exercise_date, timezone.now().date())
        date_list = [account_created_date + timezone.timedelta(days=x) for x in range((latest_date - account_created_date).days + 1)]

        for date in date_list:
            status_entry = {
                'date': date,
                'meal': meals.filter(meal_date=date).exists(),
                'exercise': exercises.filter(exercise_date=date).exists(),
            }
            registration_status.append(status_entry)

        return Response(registration_status)