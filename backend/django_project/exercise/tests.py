from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Workout,Exercise
from .serializers import WorkoutSerializer  
from accounts.models import CustomUser
from rest_framework.authtoken.models import Token
from .default_workout import default_workout_data
from django.utils import timezone
from datetime import timedelta


ENDPOINT = 'http://127.0.0.1:8000/exercise/'


# 1. get Workout 
class WorkoutListViewTest(APITestCase):
    def setUp(self):
        # テストユーザーの作成
        self.user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': False,
            'email_check': True,
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        # ログイン
        self.client.login(username='testuser', password='securepassword')
        # トークンの取得
        self.token, _ = Token.objects.get_or_create(user=self.user)
        # トークンをセット
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.get_workout_url = ENDPOINT+'get-workout/'
        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')

    def test_get_workout_list(self):
        # GETリクエストを実行
        response = self.client.get(self.get_workout_url)
        # レスポンスの検証
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータを検証（例：シリアライザのデータと一致するか）
        expected_data = WorkoutSerializer([self.workout], many=True).data
        self.assertEqual(response.data, {'workout': expected_data, 'default_workout': default_workout_data})
        
        
        
        
        
# 2. create workout
class WorkoutCreateViewTest(APITestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': False,
            'email_check': True,
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        # ログイン
        self.client.login(username='testuser', password='securepassword')
        # トークンの取得
        self.token, _ = Token.objects.get_or_create(user=self.user)
        # トークンをセット
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # WorkoutCreateView の URL
        self.workout_create_url = ENDPOINT+'post-workout/'

        # テスト用のデータ
        self.workout_data = {
            'name': 'Test Workout',
            'workout_type': 'Other'
        }
        

    def test_create_workout_success(self):
        # POSTリクエストを送信
        response = self.client.post(self.workout_create_url, self.workout_data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workout.objects.count(), 1)
        self.assertEqual(Workout.objects.get().name, 'Test Workout')

    def test_create_workout_failure(self):
        # 不正なデータでPOSTリクエストを送信
        invalid_data = {
            'name': 'test',  
            'workout_type':None #ここは、Noneではダメ。指定したものである必要あり。
        }
        response = self.client.post(self.workout_create_url, invalid_data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Workout.objects.count(), 0)
        
        




# 3. Exercise Get By Date
class ExerciseGetByDateViewTest(APITestCase):
    def setUp(self):
        # テストユーザーの作成
        self.user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': False,
            'email_check': True,
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        # ログイン
        self.client.login(username='testuser', password='securepassword')
        # トークンの取得
        self.token, _ = Token.objects.get_or_create(user=self.user)
        # トークンをセット
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.get_workout_url = ENDPOINT+'get-workout/'
        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')
        
        # exercise get url
        self.get_exercise_url = ENDPOINT+'get-exercise-date/'
        
        # テスト用のデータ
        self.exercise_date = '2023-12-21'

    def test_get_exercise_by_date_success(self):
        # Exerciseを作成
        exercise_date = timezone.now().date()
        exercise = Exercise.objects.create(
            account=self.user,
            exercise_date=exercise_date,
            workout=self.workout,
            sets=3,
            reps=10
        )

        # GETリクエストを送信
        response = self.client.get(self.get_exercise_url, {'date': self.exercise_date}, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 必要に応じて、返ってくるデータの構造や内容をテスト

    def test_get_exercise_by_date_failure_missing_date(self):
        # 'date'パラメータがない場合のGETリクエストを送信
        response = self.client.get(self.get_exercise_url, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 必要に応じて、返ってくるエラーメッセージなどをテスト