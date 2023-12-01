# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Pet
from accounts.models import CustomUser
from user_info.models import UserInfo
from exercise.models import Exercise
from meal.models import Meal
from datetime import timedelta
from datetime import datetime, timedelta
from .serializers import PetSerializer
from rest_framework.permissions import IsAuthenticated

class PetView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        user = self.request.user
        pet_date_str = request.query_params.get('pet_date', None)
        # Convert pet_date_str to datetime object
        pet_date = datetime.strptime(pet_date_str, '%Y-%m-%d').date() if pet_date_str else None

        pet = Pet.objects.filter(account=user.id,pet_date=pet_date).first()
        
        if pet is not None:
            serializer = PetSerializer(instance=pet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            
            # # ここでexercise,meal,user_infoのモデル記録状況を見てペットを保存する
            exercise = Exercise.objects.filter(account=user.id)
            meal = Meal.objects.filter(account=user.id)
            user_info = UserInfo.objects.filter(account=user.id)
            
            exercise_dates = exercise.filter(account=user.id).values('exercise_date').distinct()
            meal_dates = meal.filter(account=user.id).values('meal_date').distinct()
            
            exercise_count = exercise_dates.count()
            meal_count = meal_dates.count()
            
            print('エクササイズ',exercise_count)
            print("ミール",meal_count)
                        
            grow_stage = (
                'Adult' if meal_count >= 30 and exercise_count >= 10 else
                'Child' if meal_count >= 14 and exercise_count >= 5 else
                'Baby' if meal_count >= 7 and exercise_count >= 3 else
                'Egg2' if meal_count >= 3 and exercise_count >= 1 else
                'Egg'
            )
            
            pet_status =(
                'Thin' if not self.has_continuous_meal_records(user.id, pet_date, days=5) else
                'Fatting' if (
                    not self.has_continuous_exercise_records(user.id, pet_date, days=7)
                ) else
                'Muscular'
            )
            
            # Petモデルの作成
            serializer = PetSerializer(data={
                'account': user.id,
                'grow': grow_stage,
                'status': pet_status,
                'pet_date': pet_date
            })
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print('エラー',serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def has_continuous_meal_records(self, user_id, pet_date,days=5):
        end_date = pet_date
        start_date = end_date - timedelta(7)

        return (
                Meal.objects.filter(account=user_id, meal_date__range=(start_date, end_date)).values('meal_date').distinct().count() >= days
        )

    def has_continuous_exercise_records(self, user_id, pet_date,days=3):
        end_date = pet_date
        start_date = end_date - timedelta(7)

        return (
            Exercise.objects.filter(account=user_id, exercise_date__range=(start_date, end_date)).values('exercise_date').distinct().count() >= days
        )
            

