from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Meal,Food
from .serializers import MealSerializer, FoodSerializer,GetMealSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView




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
        
        foods = Food.objects.filter(account=user.id)
            
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