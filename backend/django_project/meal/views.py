from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.contrib.auth.decorators import login_required
from .models import Meal,Food
from .serializers import MealSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

class MealAccessView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認

    def get(self, request):
        print('start MealAccessView'),
        # print(request.session['test'])
        request.session['test']='test'
        print(request.session)
        user_id = request.user.id
        if user_id is not None:
            
            meals = Meal.objects.filter(account=user_id)  # ログインユーザーのmealを取得

            serialized_meals = MealSerializer(meals, many=True).data
            for meal in meals:
                serialized_meal = {
                    'meal_date': meal.meal_date,
                    'food':meal.food.name,
                    'meal_type':meal.meal_type,
                    'meal_serving':meal.serving,
                    'grams':meal.grams,
                }
                serialized_meals.append(serialized_meal)

            print(request.session['test'])
            return Response({'meals': serialized_meals})
        
        else:
            print('認証失敗')
            return Response({'error': 'Authentication required.'}, status=401)