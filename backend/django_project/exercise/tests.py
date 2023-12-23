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
from django.db import transaction
from .serializers import GetExerciseSerializer

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

    def test_get_exercise_by_date_failure_missing_date(self):
        # 'date'パラメータがない場合のGETリクエストを送信
        response = self.client.get(self.get_exercise_url, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        



# 4. Exercise Create
class ExerciseCreateViewTest(APITestCase):
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
        
        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')
        
        # exercise get url
        self.post_exercise_url = ENDPOINT+'post-exercise/'
        
        
    def test_create_exercise(self):
        # Exercise作成のためのデータ(is_default:False)
        exercise_data = {
            'workout_id': self.workout.id,
            'is_default':False,
            'sets': 3,
            'reps': 10,
            'duration_minutes': None,
            'distance': None,
            'mets': 6,
            'memos': 'Test memo',
            'exercise_date':timezone.now().date(),
        }

        # APIを呼び出してExerciseを作成
        response = self.client.post(self.post_exercise_url, data=exercise_data,format='json')
        # print(response.data)
        
        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Exerciseが作成されているか確認
        self.assertEqual(Exercise.objects.count(), 1)

        # 作成されたExerciseの内容が期待通りか確認
        created_exercise = Exercise.objects.first()
        self.assertEqual(created_exercise.workout, self.workout)
        self.assertEqual(created_exercise.sets, 3)
        self.assertEqual(created_exercise.reps, 10)
        self.assertIsNone(created_exercise.duration_minutes)
        self.assertIsNone(created_exercise.distance)
        self.assertEqual(created_exercise.mets,6)
        self.assertEqual(created_exercise.memos, 'Test memo')
        
        
    def test_create_exercise_with_default(self):
        # Exercise作成のためのデータ(is_default:True)
        exercise_data = {
            'workout_id': 'd20',
            'is_default':True,
            'sets': 3,
            'reps': 10,
            'duration_minutes': None,
            'distance': None,
            'mets': 8,
            'memos': 'Test memo',
            'exercise_date':timezone.now().date(),
        }

        # APIを呼び出してExerciseを作成
        response = self.client.post(self.post_exercise_url, data=exercise_data,format='json')
        # print(response.data)
        
        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Exerciseが作成されているか確認
        self.assertEqual(Exercise.objects.count(), 1)

        # 作成されたExerciseの内容が期待通りか確認
        created_exercise = Exercise.objects.first()
        self.assertEqual(created_exercise.workout.name,'Leg Curl')
        self.assertEqual(created_exercise.workout.workout_type,'Leg')
        self.assertEqual(created_exercise.workout.is_default,True)
        self.assertEqual(created_exercise.sets, 3)
        self.assertEqual(created_exercise.reps, 10)
        self.assertIsNone(created_exercise.duration_minutes)
        self.assertIsNone(created_exercise.distance)
        self.assertEqual(created_exercise.mets,8)
        self.assertEqual(created_exercise.memos, 'Test memo')
        
        




# 5. Exercise Update
class ExerciseUpdateViewTest(APITestCase):
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
        self.client.login(username='testuser', password='securepassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')
        
        # テスト用のExerciseの作成
        self.exercise = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=3,
            reps=10,
            weight_kg=None,
            duration_minutes=None,
            distance=None,
            mets=None,
            memos='Test memo',
            workout=self.workout,
        )
        
        self.exercise_update_url = ENDPOINT+f'exercise/update/{self.exercise.id}/'

    def test_update_exercise(self):
        # 更新用のデータ
        update_data = {
            'sets': None,
            'reps': None,
            'duration_minutes':30,
            'memos': 'Updated memo',
        }

        # エクササイズの更新
        response = self.client.put(
            self.exercise_update_url,
            data=update_data,
            format='json'
        )

        # print(response.data)

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # データベースからエクササイズを再取得して更新されているか確認
        updated_exercise = Exercise.objects.get(id=self.exercise.id)
        self.assertEqual(updated_exercise.sets, update_data['sets'])
        self.assertEqual(updated_exercise.reps, update_data['reps'])
        self.assertEqual(updated_exercise.duration_minutes, update_data['duration_minutes'])
        self.assertEqual(updated_exercise.memos, update_data['memos'])



# 6. Exercise Delete
class ExerciseDeleteViewTest(APITestCase):
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
        self.client.login(username='testuser', password='securepassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        # other user
        self.other_user_data = {
            'username': 'otheruser',
            'password': 'otherpassword',
            'email': 'otheruser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': False,
            'email_check': True,
        }
        self.other_user = CustomUser.objects.create_user(**self.other_user_data)
        self.client.login(username='otheruser', password='otherpassword')
        self.other_token, _ = Token.objects.get_or_create(user=self.other_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.other_token.key)

        # テスト用のWorkoutの作成
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type='Other')
        # テスト用のExerciseの作成
        self.exercise = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=3,
            reps=10,
            weight_kg=None,
            duration_minutes=None,
            distance=None,
            mets=None,
            memos='Test memo',
            workout=self.workout,
        )
        
    def test_delete_exercise(self):
        # Send a DELETE request to the ExerciseDeleteView
        response = self.client.delete(ENDPOINT+f'exercise/delete/{self.exercise.id}/')
        # Check that the response status code is 204 (No Content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # データベースからExerciseオブジェクトが削除されているか確認
        # with self.assertRaises(Exercise.DoesNotExist):
        #     Exercise.objects.get(id=self.exercise.id)


    # def test_delete_exercise_unauthorized(self):
    #     other_workout = Workout.objects.create(account=self.other_user, is_default=False, name='Test Workout', workout_type='Other') 
    #     # Create a test exercise owned by the other user
    #     other_exercise = Exercise.objects.create(
    #         account=self.user,
    #         exercise_date='2023-12-22',
    #         sets=3,
    #         reps=10,
    #         weight_kg=None,
    #         duration_minutes=None,
    #         distance=None,
    #         mets=None,
    #         memos='other user memo',
    #         workout=other_workout,
    #     )

    #     # Get the initial count of exercises
    #     initial_count = Exercise.objects.count()
    #     # Send a DELETE request to the ExerciseDeleteView for the exercise owned by the other user
    #     response = self.client.delete(ENDPOINT+f'exercise/delete/{other_exercise.id}/')
    #     # Check that the response status code is 403 (Forbidden)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #     # Check that the exercise was not deleted
    #     self.assertEqual(Exercise.objects.count(), initial_count)
    
    
    
    

# 7. latest exercise by type
class GetLatestExerciseByTypeViewTest(APITestCase):
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
        self.client.login(username='testuser', password='securepassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # テスト用のWorkoutとExerciseの作成
        self.workout_type = 'Aerobic'
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type=self.workout_type)
        self.exercise = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-22',
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=30,
            distance=3,
            mets=None,
            memos='Test memo',
            workout=self.workout,
        )

    def test_get_latest_exercise_by_type(self):
        url = ENDPOINT+'get-latest-exercise/'
        response = self.client.get(url, {'workout_type': self.workout_type})
        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータが期待通りの形式か確認
        self.assertIn('exercises', response.data)
        self.assertIsInstance(response.data['exercises'], list)
        # レスポンスのデータに作成したExerciseが含まれているか確認
        self.assertEqual(len(response.data['exercises']), 1)
        serialized_exercise = GetExerciseSerializer(self.exercise)
        self.assertIn(serialized_exercise.data, response.data['exercises'])
        





# 8. create exercises with latest data by type
class CreateExercisesWithLatestHistoryByTypeTest(APITestCase):
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
        self.client.login(username='testuser', password='securepassword')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # テスト用のWorkoutとExerciseの作成
        self.workout_type = 'Aerobic'
        self.workout = Workout.objects.create(account=self.user, is_default=False, name='Test Workout', workout_type=self.workout_type)
        self.exercise = Exercise.objects.create(
            account=self.user,
            exercise_date='2023-12-20', #3日前
            sets=None,
            reps=None,
            weight_kg=None,
            duration_minutes=30,
            distance=3,
            mets=None,
            memos='Test memo',
            workout=self.workout,
        )

    def test_create_exercises_with_latest_history_by_type(self):
        # リクエストデータをセットアップ
        request_data = {
            'workout_type': self.workout_type,
            'exercise_date': '2023-12-23',  # 新しいexercise_date
        }

        # APIエンドポイントを呼び出す
        url = ENDPOINT+'create-latest-exercise/'
        response = self.client.post(url, request_data)

        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータが期待通りの形式か確認
        self.assertIn('exercises', response.data)
        
        new_exercise = Exercise.objects.get(exercise_date='2023-12-23')
        serialized_new_exercise = GetExerciseSerializer(new_exercise)
        print('新規',serialized_new_exercise.data)