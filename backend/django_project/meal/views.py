from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Meal,Food
from .serializers import MealSerializer, FoodSerializer,GetMealSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView
import requests
from requests_oauthlib import OAuth1
import uuid
import time
import hmac
import hashlib
import base64
from urllib.parse import quote, urlencode
import os
from .helpers.extract_nutritional_values import extract_nutritional_values




#post food, save food information. ユーザーが自分用のfoodを登録し後で、mealの記録をつける際に使えるようにする。
class FoodPostView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    
    def post(self, request):
        # ログインユーザーを取得
        user = self.request.user
        
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
    
    
    
    
    
# Food List 自分が登録したFoodを確認する。
class FoodListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ログインユーザーに関連するFoodを取得
        user = self.request.user
        
        foods = Food.objects.filter(account=user.id,is_open_api=False)
            
        serialized_foods = FoodSerializer(foods, many=True)
        return Response({'foods':serialized_foods.data})
        
    
    
    
# Meal Create 自分のFoodをもとに食事内容を記録していく
class MealCreateView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    
    def post(self, request):
        user = self.request.user
        
        #先にログインユーザーのidを紐づける
        request.data['account'] = user.id
        # POSTデータをシリアライザに渡す
        serializer = MealSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            




# Get Meal By Date
class MealByDateView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認

    def get(self, request):
        
        user = self.request.user
            
        meal_date = request.query_params.get('meal_date', None)
        meals = Meal.objects.filter(meal_date=meal_date,account=user.id)   # ログインユーザーのmealを取得

        serialized_meals=GetMealSerializer(meals,many=True).data
        return Response({'meals': serialized_meals})
        

        
        
        
# update meal, mainly serving and grams.
class MealUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, meal_id):
        user = self.request.user

        meal = get_object_or_404(Meal, id=meal_id, account=user.id)
        serializer = MealSerializer(instance=meal, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        
# Meal Delete
class MealDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    
    def perform_destroy(self, instance):
        # ログインユーザーと meal の所有者が一致するか確認
        if self.request.user == instance.account:
            instance.delete()
        else:
            # 一致しない場合は権限エラーを返す
            return Response({'detail': 'You do not have permission to delete this meal.'}, status=status.HTTP_403_FORBIDDEN)
        
        
        
        

class FatSecretSearchAPIView(APIView):
    def get(self, request):
        # FatSecret API credentials
        consumer_key = os.environ.get('FOOD_API_CONSUMER_KEY')
        consumer_secret = os.environ.get('FOOD_API_CONSUMER_SECRET')
        oauth_nonce = str(uuid.uuid4())
        oauth_timestamp = str(int(time.time()))
        url = 'https://platform.fatsecret.com/rest/server.api'
        
        # Get the search expression from the query parameters
        search_expression = self.request.query_params.get('search_expression', None)
        encoded_search_expression = quote(search_expression, safe='')

        # Check if search_expression is provided
        if search_expression is None or search_expression.strip() == '':
            return Response({'error': 'Search expression is required and cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Parameters for the API request
        params = {
            'method': 'foods.search',
            'search_expression':encoded_search_expression,
            'max_results': 50,
            'format': 'json',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_consumer_key': consumer_key,
            'oauth_nonce': oauth_nonce,
            'oauth_timestamp': oauth_timestamp,
            'oauth_version': '1.0',
        }

        # OAuth 1.0aの署名を計算する
        # Extract the parameters for signing
        signing_params = {k: v for k, v in params.items() if k != ''}

        base_string = '&'.join(
            [
                'POST',
                quote(url, safe=''),
                quote(urlencode(sorted(signing_params.items())), safe=''),
            ]
        )

        # Concatenate the Consumer Secret and Token Secret with an '&'
        key = '{}&{}'.format(
            quote(consumer_secret, safe=''),  # client secret
            '',  # token secret, empty string for client credentials
        )

        # HMAC-SHA1署名を計算
        signature = hmac.new(key.encode('utf-8'), base_string.encode('utf-8'), hashlib.sha1)
        oauth_signature = base64.b64encode(signature.digest()).decode('utf-8')

        # oauth_signatureをparamsに追加
        params['oauth_signature'] = oauth_signature

        # Make the signed API request
        response = requests.post(url, params=params)
        
        # APIからのレスポンスをJSONに変換
        json_data = response.json()
        
        #  必要な情報を整理してJSON形式にする
        search_results = []
        for food in json_data.get('foods', {}).get('food', []):
            nutritional_values = extract_nutritional_values(food.get('food_description'))
        
            search_results.append({
                'food_id': food.get('food_id', ''),
                'name': food.get('food_name',''),
                'cal': nutritional_values['cal'],
                'amount_per_serving': nutritional_values['amount_per_serving'],
                'carbohydrate': nutritional_values['carbohydrate'],
                'fat': nutritional_values['fat'],
                'protein': nutritional_values['protein'],
                'is_100g' :nutritional_values['is_100g'],
                'is_serving' :nutritional_values['is_serving']
                # 他の栄養情報取得は有料
            })

        # Check if the API request was successful
        if response.status_code == 200:
            # Return the API response as JSON
            return Response(search_results, status=status.HTTP_200_OK)
        else:
            # Return an error response
            return Response({'error': 'Failed to fetch data from FatSecret API'}, status=response.status_code)




# Meal Create with FatSeceret FatSecretから取得したデータを利用してmeal登録する場合
class MealCreateWithFatSecretView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    
    def post(self, request):
        user = self.request.user
        
        # Foodデータの取得または作成
        food_data = request.data.get('food_data', {})
        meal_data = request.data.get('meal_data', {})
        print(food_data)
        print(meal_data)

        if food_data['food_id']:
            # 既存のFoodが存在する場合はそれを取得
            try:
                food = Food.objects.get(food_id=food_data['food_id'], account=user.id)
            except Food.DoesNotExist:
                # 既存のFoodが存在しない場合は新しく作成
                food_data['account']=user.id
                food_data['is_open_api']=True
                serializer = FoodSerializer(data=food_data)
                if serializer.is_valid():
                    serializer.save(account=user)
                    food = serializer.instance
                else:
                    
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print('error: food_id is required')
            return Response({'error': 'food_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Mealデータの保存
        
        meal_data['account'] = user.id
        meal_data['food'] = food.id
        print(meal_data)

        meal_serializer = MealSerializer(data=meal_data)
        if meal_serializer.is_valid():
            meal_serializer.save()
            return Response(meal_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(meal_serializer.errors)
            return Response(meal_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            