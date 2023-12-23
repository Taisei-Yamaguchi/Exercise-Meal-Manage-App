from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from accounts.models import CustomUser
from .models import Goal


ENDPOINT = 'http://127.0.0.1:8000/goal/'

# 1. Goal create or update
class GoalCreateOrUpdateViewTest(APITestCase):
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

        self.url = ENDPOINT+'create-update/'

    def test_goal_create_or_update(self):
        # ユーザーのゴール情報がまだ存在しない場合
        data = {
            'goal_intake_cals':3000,
            'goal_consuming_cals':3200,
            'goal_weight':80,
            'goal_body_fat':None,
            'goal_muscle_mass':None,
        }
        response = self.client.post(self.url, data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 応答データを検証
        # データベースから新しく作成されたGoalオブジェクトを取得
        created_goal = Goal.objects.last()
        # 渡したデータとデータベース内のオブジェクトを比較
        self.assertEqual(data['goal_intake_cals'], created_goal.goal_intake_cals)
        self.assertEqual(data['goal_consuming_cals'], created_goal.goal_consuming_cals)
        self.assertEqual(data['goal_weight'], created_goal.goal_weight)
        self.assertEqual(data['goal_body_fat'], created_goal.goal_body_fat)
        self.assertEqual(data['goal_muscle_mass'], created_goal.goal_muscle_mass)

        # 同ユーザーが再度登録
        new_data = {
            'goal_intake_cals':3500,
            'goal_consuming_cals':3000,
            'goal_weight':90,
            'goal_body_fat':15,
            'goal_muscle_mass':None,
        }
        # 応答データを検証
        response = self.client.post(self.url, new_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        updated_goal = Goal.objects.get(id=created_goal.id) #最初に作成したGoal idで取得
        # 渡したデータとデータベース内のオブジェクトを比較
        self.assertEqual(new_data['goal_intake_cals'], updated_goal.goal_intake_cals)
        self.assertEqual(new_data['goal_consuming_cals'], updated_goal.goal_consuming_cals)
        self.assertEqual(new_data['goal_weight'], updated_goal.goal_weight)
        self.assertEqual(new_data['goal_body_fat'], updated_goal.goal_body_fat)
        self.assertEqual(new_data['goal_muscle_mass'], updated_goal.goal_muscle_mass)




# get goal
class GetGoalViewTest(APITestCase):
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

        self.url = ENDPOINT+'get/'
        self.url_create = ENDPOINT+'create-update/'
        
    def test_get_goal_no_goal_available(self):
        # Goal がまだ登録されていない場合のテストケース
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_goal_with_goal_available(self):
        # Goal が登録されている場合のテストケース
        goal_data = {
            'goal_intake_cals': 3000,
            'goal_consuming_cals': 3200,
            'goal_weight': 80,
            'goal_body_fat': None,
            'goal_muscle_mass': None,
            'account':self.user
        }
        goal= Goal.objects.create(**goal_data)

        # Goal を取得するための GET リクエストを送信
        response = self.client.get(self.url)

        # ステータスコードが 200 OK であることを確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # レスポンスのデータに Goal の情報が含まれていることを確認
        self.assertIn("goal_intake_cals", response.data)
        self.assertIn("goal_consuming_cals", response.data)
        self.assertIn("goal_weight", response.data)
        self.assertIn("goal_body_fat", response.data)
        self.assertIn("goal_muscle_mass", response.data)
