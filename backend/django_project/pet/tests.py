from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from accounts.models import CustomUser
from user_info.models import UserInfo
from exercise.models import Exercise,Workout
from meal.models import Meal,Food
from datetime import date


ENDPOINT = 'http://127.0.0.1:8000/pet/'

class PetViewTest(APITestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': True,
            'email_check': True,
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        self.client.login(username='testuser', password='securepassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # API エンドポイントの URL をセットアップ
        self.url = ENDPOINT+'get-pet/'
        
        # テスト用のWorkoutとExerciseの作成
        self.workout1 = Workout.objects.create(
            account=self.user,
            is_default=False,
            name='Test Workout1',
            workout_type='Aerobic'
        )
        self.exercise1 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=30,
            distance=None,
            mets=8,
            memos='Test memo',
            workout=self.workout1,
        )
        
        self.workout2 = Workout.objects.create(
            account=self.user,
            is_default=False,
            name='Test Workout2',
            workout_type='Chest'
        )
        self.exercise2 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=10,
            reps=10,
            weight_kg=100,
            duration_minutes=None,
            distance=None,
            mets=8,
            memos='Test memo',
            workout=self.workout2,
        )
        
        self.workout3 = Workout.objects.create(
            account=self.user,
            is_default=False,
            name='Test Workout3',
            workout_type='Leg'
        )
        self.exercise3 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-19',
            sets=5,
            reps=12,
            weight_kg=120,
            duration_minutes=None,
            distance=None,
            mets=12,
            memos='Test memo',
            workout=self.workout3,
        )
        
        # Food,Mealを作成
        self.food1 = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        self.meal1 = Meal.objects.create(
            food=self.food1,
            serving=1,
            meal_date='2023-12-22',
            account=self.user,
            meal_type='dinner',
        )
        
        self.food2 = Food.objects.create(
            name='Test Food2',
            amount_per_serving=200,
            cal=300,
            account=self.user,
        )
        self.meal2 = Meal.objects.create(
            food=self.food2,
            grams=300,
            meal_date='2023-12-22',
            account=self.user,
            meal_type='dinner',
        )
        
        self.meal3 = Meal.objects.create(
            food=self.food1,
            grams=400,
            meal_date='2023-12-21',
            account=self.user,
            meal_type='breakfast',
        )
        
        # 事前にUserInfoモデルを作る
        self.latest_data = {
            'date': '2023-12-21',
            'weight': 87,
            'height': 187,
            'body_fat_percentage': 7,
            'muscle_mass': 75,
            'metabolism': 2100,
            'account': self.user,  # ユーザーとの関連付け
        }
        # UserInfo モデルを作成
        self.latest_user_info= UserInfo.objects.create(**self.latest_data)

    def test_get_pet_info(self):
        # Set the pet_date parameter to the date for which you want to test
        pet_date = '2023-12-24'
        other_pet_date = '2023-12-25'
        

        # Call the PetView to get or create the pet information
        response = self.client.get(self.url+'?pet_date='+pet_date)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # 新規作成
        print(response.data)

        # 同じ日に2度目のrequest
        response = self.client.get(self.url+'?pet_date='+pet_date)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 既存のデータを取得
        print(response.data)

        # 別の日にrequest
        response = self.client.get(self.url+'?pet_date='+other_pet_date)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  #　新規作成
        print(response.data)