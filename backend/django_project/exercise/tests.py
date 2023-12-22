from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Workout  
from .serializers import WorkoutSerializer  
from accounts.models import CustomUser
from rest_framework.authtoken.models import Token
from .default_workout import default_workout_data


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


        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')

    def test_get_workout_list(self):
        # WorkoutListViewのURLを取得
        url = ENDPOINT+'get-workout/'
        # GETリクエストを実行
        response = self.client.get(url)
        # レスポンスの検証
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータを検証（例：シリアライザのデータと一致するか）
        expected_data = WorkoutSerializer([self.workout], many=True).data
        self.assertEqual(response.data, {'workout': expected_data, 'default_workout': default_workout_data})