from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date, timedelta
from rest_framework.authtoken.models import Token
from accounts.models import CustomUser
from user_info.models import UserInfo
from goal.models import Goal
from exercise.models import Workout,Exercise
from meal.models import Food,Meal



ENDPOINT ='http://127.0.0.1:8000/graph/'

# 1. weight graph
class WeightDataAPIViewTest(APITestCase):
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
        self.url = ENDPOINT+'weight-graph/'

    def test_weight_data_api(self):
        # 事前にUserInfoモデルを作る
        early_data = {
            'date': '2023-12-15',
            'weight': 80,
            'height': 180,
            'body_fat_percentage': 1,
            'muscle_mass': None,
            'metabolism': 1900,
            'account': self.user,  # ユーザーとの関連付け
        }
        latest_data = {
            'date': '2023-12-19',
            'weight': 87,
            'height': 187,
            'body_fat_percentage': 7,
            'muscle_mass': 75,
            'metabolism': 2100,
            'account': self.user,  # ユーザーとの関連付け
        }
        # UserInfo モデルを作成
        ealry_user_info= UserInfo.objects.create(**early_data)
        latest_user_info= UserInfo.objects.create(**latest_data)
        
        goal_data = {
            'goal_intake_cals': 3000,
            'goal_consuming_cals': 3200,
            'goal_weight': 90,
            'goal_body_fat': 10,
            'goal_muscle_mass': 70,
            'account':self.user
        }
        goal= Goal.objects.create(**goal_data)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # レスポンスデータの中身を確認
        data = response.json()
        self.assertTrue(isinstance(data, dict))
        
        # 必要なキーが含まれていることを確認
        self.assertTrue(all(key in data for key in ['weight_data', 'goal_weight']))
        
        # weight_data がリストであり、各エントリーが必要なキーを持っていることを確認
        weight_data = data['weight_data']
        self.assertTrue(isinstance(weight_data, list))
        self.assertTrue(all(entry.keys() == {'date', 'weight'} for entry in weight_data))
        # print(data)




# 2. body fat graph
class WeightDataAPIViewTest(APITestCase):
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
        self.url = ENDPOINT+'body_fat_percentage-graph/'

    def test_body_fat_data_api(self):
        # 事前にUserInfoモデルを作る
        early_data = {
            'date': '2023-12-15',
            'weight': 80,
            'height': 180,
            'body_fat_percentage': 10,
            'muscle_mass': None,
            'metabolism': 1900,
            'account': self.user,  # ユーザーとの関連付け
        }
        latest_data = {
            'date': '2023-12-19',
            'weight': 87,
            'height': 187,
            'body_fat_percentage': 7,
            'muscle_mass': 75,
            'metabolism': 2100,
            'account': self.user,  # ユーザーとの関連付け
        }
        # UserInfo モデルを作成
        ealry_user_info= UserInfo.objects.create(**early_data)
        latest_user_info= UserInfo.objects.create(**latest_data)
        
        goal_data = {
            'goal_intake_cals': 3000,
            'goal_consuming_cals': 3200,
            'goal_weight': 90,
            'goal_body_fat': 10,
            'goal_muscle_mass': 70,
            'account':self.user
        }
        goal= Goal.objects.create(**goal_data)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # レスポンスデータの中身を確認
        data = response.json()
        self.assertTrue(isinstance(data, dict))
        
        # 必要なキーが含まれていることを確認
        self.assertTrue(all(key in data for key in ['body_fat_data', 'goal_body_fat']))
        
        # weight_data がリストであり、各エントリーが必要なキーを持っていることを確認
        body_fat_data = data['body_fat_data']
        self.assertTrue(isinstance(body_fat_data, list))
        self.assertTrue(all(entry.keys() == {'date', 'body_fat_percentage'} for entry in body_fat_data))
        # print(data)




# 3. muscle mass graph
class WeightDataAPIViewTest(APITestCase):
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
        self.url = ENDPOINT+'muscle_mass-graph/'

    def test_body_fat_data_api(self):
        # 事前にUserInfoモデルを作る
        early_data = {
            'date': '2023-12-15',
            'weight': 80,
            'height': 180,
            'body_fat_percentage': 10,
            'muscle_mass': 65,
            'metabolism': 1900,
            'account': self.user,  # ユーザーとの関連付け
        }
        latest_data = {
            'date': '2023-12-19',
            'weight': 87,
            'height': 187,
            'body_fat_percentage': 7,
            'muscle_mass': 75,
            'metabolism': 2100,
            'account': self.user,  # ユーザーとの関連付け
        }
        # UserInfo モデルを作成
        ealry_user_info= UserInfo.objects.create(**early_data)
        latest_user_info= UserInfo.objects.create(**latest_data)
        
        goal_data = {
            'goal_intake_cals': 3000,
            'goal_consuming_cals': 3200,
            'goal_weight': 90,
            'goal_body_fat': 10,
            'goal_muscle_mass': 70,
            'account':self.user
        }
        goal= Goal.objects.create(**goal_data)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # レスポンスデータの中身を確認
        data = response.json()
        self.assertTrue(isinstance(data, dict))
        
        # 必要なキーが含まれていることを確認
        self.assertTrue(all(key in data for key in ['muscle_mass_data', 'goal_muscle_mass']))
        
        # weight_data がリストであり、各エントリーが必要なキーを持っていることを確認
        muscle_mass_data = data['muscle_mass_data']
        self.assertTrue(isinstance(muscle_mass_data, list))
        self.assertTrue(all(entry.keys() == {'date', 'muscle_mass'} for entry in muscle_mass_data))
        # print(data)



# 4. Eexercise Total Wieght list
class ExerciseTotalWeight(APITestCase):
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
        self.url = ENDPOINT+'total-weight-graph/'
        
        # テスト用のWorkoutとExerciseの作成
        self.workout1 = Workout.objects.create(
            account=self.user,
            is_default=False,
            name='Test Workout1',
            workout_type='Chest'
        )
        self.exercise1 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=5,
            reps=10,
            weight_kg=100,
            duration_minutes=None,
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
            exercise_date='2023-12-20',
            sets=3,
            reps=5,
            weight_kg=110,
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
        
    def test_exercise_total_weight(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)



# 5. Eexercise Daily Wieght list by type
class ExerciseDailyWeightByType(APITestCase):
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
        self.url = ENDPOINT+'daily-total-weight-graph/'
        
        # テスト用のWorkoutとExerciseの作成
        self.workout1 = Workout.objects.create(
            account=self.user,
            is_default=False,
            name='Test Workout1',
            workout_type='Chest'
        )
        self.exercise1 = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=5,
            reps=10,
            weight_kg=100,
            duration_minutes=None,
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
            exercise_date='2023-12-20',
            sets=3,
            reps=5,
            weight_kg=110,
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
        
    def test_exercise_total_weight_all(self):
        response = self.client.get(self.url,{'workout_type':'All'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print('毎日重量',response.data)
    
    def test_exercise_total_weight_type(self):
        response = self.client.get(self.url,{'workout_type':'Chest'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
    
    def test_exercise_total_weight_notExistType(self):
        response = self.client.get(self.url,{'workout_type':'xxx'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print('無存在',response.data)
        

# 6. Cals Grpah
class CalsGraphTest(APITestCase):
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
        self.url = ENDPOINT+'cals-graph/'
        
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
        self.early_data = {
            'date': '2023-12-17',
            'weight': 80,
            'height': 180,
            'body_fat_percentage': 10,
            'muscle_mass': 65,
            'metabolism': 1900,
            'account': self.user,  # ユーザーとの関連付け
        }
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
        self.ealry_user_info= UserInfo.objects.create(**self.early_data)
        self.latest_user_info= UserInfo.objects.create(**self.latest_data)
        
        
    def test_cals_graph_data(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print('カロリー',response.data)


# 7. Daily Nutrients Graph