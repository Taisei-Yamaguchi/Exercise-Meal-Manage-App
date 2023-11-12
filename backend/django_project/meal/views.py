from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.contrib.auth.decorators import login_required
from .models import Meal,Food
from .serializers import MealSerializer, FoodSerializer 
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated


#post food, save food information. ユーザーが自分用のfoodを登録し後で、mealの記録をつける際に使えるようにする。
class FoodPostView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    
    def post(self, request):
        # ログインユーザーを取得
        user = self.request.user
        if user.is_authenticated:
            # POSTデータをシリアライザに渡す
            request.data['account'] = user.id
            serializer = FoodSerializer(data=request.data)
            if serializer.is_valid():
                # ログインユーザーに紐付けて保存
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
    
    
    
    
    
class MealAccessView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認

    def get(self, request):
        print('start MealAccessView'),
        user_id = request.user.id
        if user_id is not None:
            
            meals = Meal.objects.filter(account=user_id)   # ログインユーザーのmealを取得

            serialized_meals = []
            for meal in meals:
                serialized_meal = {
                    'id':meal.id,
                    'meal_date': meal.meal_date,
                    'food':FoodSerializer(meal.food).data,
                    'meal_type':meal.meal_type,
                    'meal_serving':meal.serving,
                    'grams':meal.grams,
                }
                serialized_meals.append(serialized_meal)

            
            return Response({'meals': serialized_meals})
        
        else:
            print('認証失敗')
            return Response({'error': 'Authentication required.'}, status=401)