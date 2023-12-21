from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import CustomUser  # このimport文を適切なモジュールに置き換えてください
from accounts.serializers import CustomUserSerializer  # このimport文を適切なモジュールに置き換えてください
from datetime import date
from django.urls import reverse
from django.contrib.auth.tokens import default_token_generator
from rest_framework.test import APITestCase
from django.utils.http import urlsafe_base64_encode
from django.core.mail import outbox


ENDPOINT = 'http://127.0.0.1:8000/'


# 1. accounts signup
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




# 2. accounts signup-confirmation
class SignUpConfirmEmailAPIViewTest(APITestCase):
    def test_confirm_email_success(self):
        # 有効なユーザーとトークンを作成
        user = get_user_model().objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        token = default_token_generator.make_token(user)
        
        # APIリクエストを作成
        url = ENDPOINT+'accounts/signup-confirmation/'  # URLはプロジェクトの実際の設定に合わせて変更してください
        query_params = {'uid': urlsafe_base64_encode(str(user.id).encode()), 'token': token}
        response = self.client.post(url, data=query_params, format='json')
        
        # レスポンスを検証
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Email confirmed successfully.')

        # ユーザーのemail_checkがTrueになっているか検証
        user.refresh_from_db()
        self.assertTrue(user.email_check)

    def test_confirm_email_invalid_token(self):
        # 有効なユーザーと無効なトークンを作成
        user = get_user_model().objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        invalid_token = 'invalid_token'
        
        # APIリクエストを作成
        url = ENDPOINT+'accounts/signup-confirmation/'  # URLはプロジェクトの実際の設定に合わせて変更してください
        query_params = {'uid': urlsafe_base64_encode(str(user.id).encode()), 'token': invalid_token}
        response = self.client.post(url, data=query_params, format='json')
        
        # レスポンスを検証
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid token or user not found.')

    def test_confirm_email_missing_uid(self):
        # uidがない場合のAPIリクエストを作成
        url = ENDPOINT+'accounts/signup-confirmation/'  # URLはプロジェクトの実際の設定に合わせて変更してください
        data = {'token': 'some_token'}
        response = self.client.post(url, data, format='json')
        
        # レスポンスを検証
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'uid is required.')
        
        
        

class PasswordResetRequestAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password_reset_request_url = ENDPOINT+'accounts/reset-password-request/'

    def test_password_reset_request_existing_user(self):
        # 既存のユーザーを作成
        user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com',
            'name': 'John Doe',
            'birthday': '2000-01-01',
            'sex': False,
            'email_check': True,
        }
        user = get_user_model().objects.create_user(**user_data)

        # リセットリクエストを送信
        data = {'email': user.email}
        response = self.client.post(self.password_reset_request_url, data, format='json')
        
        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Password reset link sent successfully.')

        # # ユーザーのデータが更新されていることを確認
        user.refresh_from_db()
        self.assertIsNotNone(user.password_reset_sent)

        # # メールが送信されていることを確認 SSLを設定してないから、まだできない
        # self.assertEqual(len(outbox), 1)
        # self.assertIn('Password Reset', outbox[0].subject)
        # self.assertIn(user.email, outbox[0].to)

    def test_password_reset_request_non_existing_user(self):
        # 存在しないユーザーのメールを指定してリセットリクエストを送信
        data = {'email': 'nonexistentuser@example.com'}
        response = self.client.post(self.password_reset_request_url, data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)