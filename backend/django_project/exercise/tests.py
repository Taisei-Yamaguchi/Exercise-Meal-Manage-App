from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status


class MyAPITestCase(APITestCase):

    def test_my_api_view(self):
        # テストデータの作成などの準備

        # APIエンドポイントにリクエストを送信
        response = self.client.get('http://127.0.0.1:8000/exercise/get-workout/')

        # レスポンスの確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['key'], 'expected_value')
        