from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from datetime import date, timedelta
from accounts.models import CustomUser
from meal.models import Food,Meal
from exercise.models import Workout,Exercise


ENDPOINT ='http://127.0.0.1:8000/main/'


# 1. Registration statsu check
class RegistrationStatusCheckViewTest(APITestCase):
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
        self.url = ENDPOINT+'registration-status-check/'

    def test_registration_status_check(self):
        # テスト用のWorkoutとExerciseの作成
        workout_type = 'Aerobic'
        workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type=workout_type)
        exercise = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=30,
            distance=3,
            mets=7,
            memos='Test memo',
            workout=workout,
        )
        
        exercise2 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-24',
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=50,
            distance=5,
            mets=10,
            memos='Test memo2',
            workout=workout,
        )
        
        # Foodを作成
        food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        # Mealを作成
        meal = Meal.objects.create(
            food=food,
            serving=1,
            meal_date='2023-12-22',
            account=self.user,
            meal_type='dinner',
        )
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # レスポンスデータの中身を確認
        data = response.json()
        self.assertTrue(isinstance(data, list))
        # date, meal, exercise のキーを持つ辞書が含まれていることを確認
        for entry in data:
            self.assertTrue('date' in entry)
            self.assertTrue('meal' in entry)
            self.assertTrue('exercise' in entry)
        print(data)
        


# 2.cals by date
class CalsByDateViewTest(APITestCase):
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
        self.url = ENDPOINT+'cals-by-date/'
        
    def test_cals_by_date(self):
        test_date ='2023-12-22'
        # Foodを作成
        food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        # Mealを作成
        meal = Meal.objects.create(
            food=food,
            serving=2,
            meal_date= test_date,
            account=self.user,
            meal_type='dinner',
        )
        
        workout_type = 'Aerobic'
        workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type=workout_type)
        exercise = Exercise.objects.create(
            account=self.user,
            exercise_date= test_date,
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=30,
            distance=3,
            mets=7,
            memos='Test memo',
            workout=workout,
        )
        
        response = self.client.get(self.url, {'date': test_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(isinstance(data, dict))
        
        # 必要なキーが含まれていることを確認
        self.assertTrue('intake_cals' in data)
        self.assertTrue('bm_cals' in data)
        self.assertTrue('exercise_cals' in data)
        self.assertTrue('food_cals' in data)
        print(data)



# 3. PFC Sum By Date
class PFCSumByDateViewTest(APITestCase):
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
        self.url = ENDPOINT+'pfc-by-date/'
    
    def test_pfc_sum_by_date(self):
        test_date ='2023-12-22'
        # Foodを作成
        food1 = Food.objects.create(
            name='Test Food',
            amount_per_serving=200,
            cal=200,
            account=self.user,
            carbohydrate=100,
            fat= 10,
            protein=20
        )
        food2 = Food.objects.create(
            name='Test Food',
            amount_per_serving=300,
            cal=300,
            account=self.user,
            carbohydrate=50,
            fat= 1,
        )
        
        # Mealを作成
        meal1 = Meal.objects.create(
            food=food1,
            serving=2,
            meal_date= test_date,
            account=self.user,
            meal_type='dinner',
        )
        meal2 = Meal.objects.create(
            food=food2,
            serving=5,
            meal_date= test_date,
            account=self.user,
            meal_type='lunch',
        )
        
        response = self.client.get(self.url, {'date': test_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(isinstance(data, list))
        # 必要なキーが含まれていることを確認
        self.assertTrue(all(entry.keys() == {'nutrient', 'amount'} for entry in data))
        # 各栄養素の総摂取量が期待通りであることを確認
        for entry in data:
            nutrient = entry['nutrient']
            amount = entry['amount']
        print(data)
