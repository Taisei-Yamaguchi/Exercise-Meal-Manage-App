from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from accounts.models import CustomUser
from .models import UserInfo 


ENDPOINT ='http://127.0.0.1:8000/user_info/'

# 1. user info create or update
class UserInfoCreateOrUpdateViewTest(APITestCase):
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
        self.url_create_or_update_info = ENDPOINT+'create-update/'

    def test_user_info_create_or_update(self):
        # UserInfo 新規作成のテストケース
        data = {
            'date': '2023-01-01',
            'weight': 85, # 必須
            'height': 185,# 必須
            'body_fat_percentage': 10,
            'muscle_mass':None,
            'metabolism': None, #None の場合、自動計算
        }

        response = self.client.post(self.url_create_or_update_info, data, format='json')
        # ステータスコードが 201 Created であることを確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created_user_info =UserInfo.objects.get()
        # UserInfo が正しく作成または更新されたかどうかを確認
        self.assertEqual(UserInfo.objects.count(), 1)
        self.assertEqual(created_user_info.weight, data['weight'])
        self.assertEqual(created_user_info.height, data['height'])
        self.assertEqual(created_user_info.body_fat_percentage, data['body_fat_percentage'])
        self.assertEqual(created_user_info.muscle_mass, data['muscle_mass'])
        print(created_user_info.metabolism) # meatbolism が自動計算
        
        
        # UserInfo 更新のケース 
        update_data = {
            'date': '2023-01-01',
            'weight': 90, # 必須
            'height': 188,# 必須
            'body_fat_percentage': 5,
            'muscle_mass':80,
            'metabolism': None, #None の場合、自動計算
        }

        response = self.client.post(self.url_create_or_update_info, update_data, format='json')
        # ステータスコードが 201 Created であることを確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        update_user_info =UserInfo.objects.get(id=created_user_info.id)
        # UserInfo が正しく更新されたかどうかを確認
        self.assertEqual(UserInfo.objects.count(), 1) # 更新なのでcountは1のまま
        self.assertEqual(update_user_info.weight, update_data['weight'])
        self.assertEqual(update_user_info.height, update_data['height'])
        self.assertEqual(update_user_info.body_fat_percentage, update_data['body_fat_percentage'])
        self.assertEqual(update_user_info.muscle_mass, update_data['muscle_mass'])
        print(update_user_info.metabolism) # meatbolism が自動計算
        
        
        # UserInfo 別日新規作成のケース 
        new_data = {
            'date': '2023-01-03',
            'weight': 87, # 必須
            'height': 187,# 必須
            'body_fat_percentage': 7,
            'muscle_mass':75,
            'metabolism': 2100, #None の場合、自動計算
        }

        response = self.client.post(self.url_create_or_update_info, new_data, format='json')
        # ステータスコードが 201 Created であることを確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_user_info =UserInfo.objects.get(date=new_data['date'])
        
        # UserInfo が正しく作成されたかどうかを確認
        self.assertEqual(UserInfo.objects.count(), 2) # 新規作成なのでcountは2
        self.assertEqual(new_user_info.weight, new_data['weight'])
        self.assertEqual(new_user_info.height, new_data['height'])
        self.assertEqual(new_user_info.body_fat_percentage, new_data['body_fat_percentage'])
        self.assertEqual(new_user_info.muscle_mass, new_data['muscle_mass'])
        print(new_user_info.metabolism) # meatbolism が自動計算



# 2. get latest user_info
class LatestUserInfoTest(APITestCase):
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
        self.url_latest_info = ENDPOINT+'get-latest/'

    def test_latest_user_info(self):
        # 事前にUserInfoモデルを作る
        early_data = {
            'date': '2023-01-01',
            'weight': 80,
            'height': 180,
            'body_fat_percentage': 1,
            'muscle_mass': None,
            'metabolism': 1900,
            'account': self.user,  # ユーザーとの関連付け
        }
        latest_data = {
            'date': '2023-01-03',
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
        
        response = self.client.get(self.url_latest_info)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['weight'], latest_user_info.weight)
        self.assertEqual(response.data['height'], latest_user_info.height)
        self.assertEqual(response.data['body_fat_percentage'], latest_user_info.body_fat_percentage)
        self.assertEqual(response.data['muscle_mass'], latest_user_info.muscle_mass)
        self.assertEqual(response.data['metabolism'], latest_user_info.metabolism)
    