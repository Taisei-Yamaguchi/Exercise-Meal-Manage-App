from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import CustomUser  # このimport文を適切なモジュールに置き換えてください
from accounts.serializers import CustomUserSerializer  # このimport文を適切なモジュールに置き換えてください
from datetime import date

ENDPOINT = 'http://127.0.0.1:8000/'

class SignupAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = ENDPOINT+'accounts/signup/'  # このURLは実際のエンドポイントに置き換えてください

    def create_test_user(self, email_check=False):
        # テストで使用するデータを作成
        user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',  # 適切な形式に変更すること
            'sex': False,
            'email_check': False,
        }

        # POSTリクエストを実行
        response = self.client.post(self.signup_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('detail', response.data)
        

    def test_signup_existing_user_email_check_true(self):
        # 既存のユーザーを作成
        existing_user_data = {
            'username': 'test@example.com',
            'password': 'securepassword',
            'email': 'test@example.com',
            'name': 'John Doe',
            'birthday': date.today(),
            'sex': False,
            'email_check': True,
        }
        self.create_test_user(existing_user_data)
        
        new_user_data = {
            'username': 'test@example.com',
            'password': 'newpassword',
            'email': 'test@example.com',  # 既存ユーザーと同じemailに変更
            'name': 'John Doe',
            'birthday': date.today(),
            'sex': False,
            'email_check': True,  # 既存ユーザーが削除されるため新しいユーザーは作成される
        }

        response = self.client.post(self.signup_url, new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('Success! Check your email for confirmation.', response.data['detail'])


    def test_signup_existing_user_email_check_false(self):
        # 既存のユーザーを作成
        existing_user_data = {
            'username': 'test@example.com',
            'password': 'securepassword',
            'email': 'test@example.com',
            'name': 'John Doe',
            'birthday': date.today(),
            'sex': False,
            'email_check': False,
        }
        self.create_test_user(existing_user_data)
        
        new_user_data = {
            'username': 'test@example.com',
            'password': 'newpassword',
            'email': 'test@example.com',  # 既存ユーザーと同じemailに変更
            'name': 'John Doe',
            'birthday': date.today(),
            'sex': False,
            'email_check': False,  # 既存ユーザーが削除されるため新しいユーザーは作成される
        }

        response = self.client.post(self.signup_url, new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('Success! Check your email for confirmation.', response.data['detail'])
    

    # def test_signup_invalid_data(self):
    #     # 無効なデータでテスト
    #     data = {
    #         # 'email': 'invalidemail',  # 無効なメールアドレス
    #         'password': 'short',  # 短すぎるパスワード
    #     }

    #     response = self.client.post(self.signup_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     # self.assertIn('This field must be a valid email address.', response.data['email'][0])
    #     self.assertIn('Ensure this field has at least 8 characters.', response.data['password'][0])
        
    # def test_signup_empty_username(self):
    #     data = {
    #         'email': 'test@example.com',
    #         'password': 'securepassword',
    #         'username': '',  # 空のusername
    #     }

    #     response = self.client.post(self.signup_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertIn('This field may not be blank.', response.data['username'][0])

    # def test_signup_empty_password(self):
    #     data = {
    #         'email': 'test@example.com',
    #         'password': '',  # 空のpassword
    #         'username': 'testuser',
    #     }

    #     response = self.client.post(self.signup_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertIn('This field may not be blank.', response.data['password'][0])



    