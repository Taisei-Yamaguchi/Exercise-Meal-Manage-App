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
from django.shortcuts import get_object_or_404
import logging

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
        
    
    
# Food List 自分が登録したFoodを確認する。
class FoodListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ログインユーザーに関連するFoodを取得
        user_id = request.user.id
        if user_id is not None:
            
            foods = Food.objects.filter(account=user_id)
            
            serialized_foods = FoodSerializer(foods, many=True)
            return Response({'foods':serialized_foods.data})
        else:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    
    
    
# Meal Create 自分のFoodをもとに食事内容を記録していく
class MealCreateView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    
    def post(self, request):
        user = self.request.user
        
        if user.is_authenticated:
            #先にログインユーザーのidを紐づける
            request.data['account'] = user.id
            # POSTデータをシリアライザに渡す
            serializer = MealSerializer(data=request.data)
            if serializer.is_valid():
                
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                
                # バリデーションエラーがある場合、ログにエラー内容を記録
                logger = logging.getLogger(__name__)
                logger.error(f"Meal create validation failed: {serializer.errors}")
                
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)




# Get Meal By Date
class MealByDateView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認

    def get(self, request):
        
        user_id = request.user.id
        if user_id is not None:
            
            meal_date = request.query_params.get('meal_date', None)
            meals = Meal.objects.filter(meal_date=meal_date,account=user_id)   # ログインユーザーのmealを取得

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
        
        
        
        
# Get All Meal list
class MealAccessView(APIView):
    permission_classes = [IsAuthenticated]
    
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