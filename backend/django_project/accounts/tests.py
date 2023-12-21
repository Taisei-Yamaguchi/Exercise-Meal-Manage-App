from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import CustomUser  # このimport文を適切なモジュールに置き換えてください
from accounts.serializers import CustomUserSerializer  # このimport文を適切なモジュールに置き換えてください
from datetime import date
from django.contrib.auth.tokens import default_token_generator
from rest_framework.test import APITestCase
from django.utils.http import urlsafe_base64_encode
from django.core.mail import outbox
from django.utils.encoding import force_bytes
from datetime import timedelta
from django.utils import timezone 


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
        
        
        
        
        
        
# class PasswordResetConfirmAPIViewTest(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.password_reset_confirm_url = ENDPOINT+'reset-password-confirm/'

#     def test_password_reset_confirm_success(self):
#         # 仮のユーザーを作成
#         user_data = {
#             'username': 'testuser',
#             'password': 'securepassword',
#             'email': 'testuser@example.com',
#             'name': 'John Doe',
#             'birthday': '2000-01-01',
#             'sex': False,
#             'email_check':True,
#         }
#         user = get_user_model().objects.create_user(user_data)

#         # パスワードリセットトークンを作成
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         token = default_token_generator.make_token(user)

#         # パスワードリセットリクエストを送信
#         data = {'uid': uid, 'token': token, 'new_password': 'newsecurepassword'}
#         response = self.client.post(self.password_reset_confirm_url, data, format='json')

#         # レスポンスの確認
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['detail'], 'Password reset successful.')

#         # パスワードが更新されていることを確認
#         user.refresh_from_db()
#         self.assertTrue(user.check_password('newsecurepassword'))

#         # トークンが無効になっていることを確認
#         self.assertIsNone(user.password_reset_sent)

#     def test_password_reset_confirm_invalid_token(self):
#         # 仮のユーザーを作成
#         user_data = {
#             'username': 'testuser',
#             'password': 'securepassword',
#             'email': 'testuser@example.com',
#             'name': 'John Doe',
#             'birthday': '2000-01-01',
#             'sex': False,
#         }
#         user = get_user_model().objects.create_user(**user_data)

#         # 無効なトークンを作成
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         invalid_token = 'invalidtoken'

#         # パスワードリセットリクエストを送信
#         data = {'uid': uid, 'token': invalid_token, 'new_password': 'newsecurepassword'}
#         response = self.client.post(self.password_reset_confirm_url, data, format='json')

#         # レスポンスの確認
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(response.data['detail'], 'Invalid or expired token.')

#         # パスワードが更新されていないことを確認
#         user.refresh_from_db()
#         self.assertTrue(user.check_password('securepassword'))

#     def test_password_reset_confirm_invalid_uid(self):
#         # 無効な UID を指定してリクエストを送信
#         invalid_uid = 'invaliduid'
#         invalid_token = 'invalidtoken'

#         data = {'uid': invalid_uid, 'token': invalid_token, 'new_password': 'newsecurepassword'}
#         response = self.client.post(self.password_reset_confirm_url, data, format='json')

#         # レスポンスの確認
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(response.data['detail'], 'Invalid uid.')

#     def test_password_reset_confirm_expired_token(self):
#         # 仮のユーザーを作成
#         user_data = {
#             'username': 'testuser',
#             'password': 'securepassword',
#             'email': 'testuser@example.com',
#             'name': 'John Doe',
#             'birthday': '2000-01-01',
#             'sex': False,
#         }
#         user = get_user_model().objects.create_user(**user_data)

#         if user.password_reset_sent is None:
#             user.password_reset_sent = timezone.now()  # あるいはデフォルトの値を設定
#         user.password_reset_sent = user.password_reset_sent - timedelta(days=2)  # 2日前に設定
#         # 有効期限切れのトークンを作成
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         expired_token = default_token_generator.make_token(user)
#         user.password_reset_sent = user.password_reset_sent - timedelta(days=2)  # 2日前に設定
#         user.save()

#         # パスワードリセットリクエストを送信
#         data = {'uid': uid, 'token': expired_token, 'new_password': 'newsecurepassword'}
#         response = self.client.post(self.password_reset_confirm_url, data, format='json')

#         # レスポンスの確認
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(response.data['detail'], 'Invalid or expired token.')

#         # パスワードが更新されていないことを確認
#         user.refresh_from_db()
#         self.assertTrue(user.check_password('securepassword'))







class LoginViewTest(APITestCase):
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
        self.user = get_user_model().objects.create_user(**self.user_data)

        # LoginView の URL
        self.login_url = ENDPOINT+"accounts/login/"

    def test_login_success(self):
        # 正しいユーザー名とパスワードでログイン
        data = {'username': 'testuser', 'password': 'securepassword'}
        response = self.client.post(self.login_url, data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['name'], 'John Doe')
        self.assertEqual(response.data['email'], 'testuser@example.com')

    def test_login_failure_invalid_credentials(self):
        # 無効なユーザー名とパスワードでログイン
        data = {'username': 'invaliduser', 'password': 'invalidpassword'}
        response = self.client.post(self.login_url, data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data)

    def test_login_failure_inactive_user(self):
        # アクティブでないユーザーでログイン
        self.user.is_active = False
        self.user.save()

        data = {'username': 'testuser', 'password': 'securepassword'}
        response = self.client.post(self.login_url, data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data)

    def test_login_failure_email_not_checked(self):
        # メールが確認されていないユーザーでログイン
        self.user.email_check = False
        self.user.save()

        data = {'username': 'testuser', 'password': 'securepassword'}
        response = self.client.post(self.login_url, data, format='json')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data)
        
        
        
