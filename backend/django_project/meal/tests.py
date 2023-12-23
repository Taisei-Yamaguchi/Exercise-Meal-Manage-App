from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import CustomUser
from django.urls import reverse
from rest_framework.authtoken.models import Token
from .models import Food,Meal
from .serializers import MealSerializer, FoodSerializer,GetMealSerializer

ENDPOINT = 'http://127.0.0.1:8000/meal/'

# 1. Food Post
class FoodPostViewTest(APITestCase):
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
        
        self.url = ENDPOINT+'food/post/'

    def test_food_post(self):
        # リクエストデータをセットアップ
        request_data = {
            'name': 'Test Food',
            'cal': 200,
            'protein': 20,
            'carbohydrate': 30,
            'fat': 10,
            'amount_per_serving': 100,
        }

        # APIエンドポイントを呼び出す
        response = self.client.post(self.url, request_data,format='json')
        # print(response.data)

        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # レスポンスのデータが期待通りの形式か確認
        self.assertIn('id', response.data)
        self.assertEqual(response.data['name'], 'Test Food')
        self.assertEqual(response.data['cal'], 200)
        self.assertEqual(response.data['protein'], 20)
        self.assertEqual(response.data['carbohydrate'], 30)
        self.assertEqual(response.data['fat'], 10)
        self.assertEqual(response.data['amount_per_serving'], 100)
        
        # データベースに正しくデータが保存されたか確認
        food = Food.objects.get(id=response.data['id'])
        self.assertEqual(food.name, 'Test Food')
        self.assertEqual(food.cal, 200)
        self.assertEqual(food.protein, 20)
        self.assertEqual(food.carbohydrate, 30)
        self.assertEqual(food.fat, 10)
        self.assertEqual(food.amount_per_serving, 100)
        self.assertEqual(food.is_open_api, False)
        self.assertEqual(food.account, self.user)

    def test_food_post_invalid_data(self):
        # 不正なデータ（nameが抜けてる）
        invalid_data = {
            # 'name': 'Test Food',
        }
        response = self.client.post(self.url, invalid_data, format='json')
        # リクエストが失敗し、適切なエラーステータスが返されたことを確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        


# 2. Food List
class FoodListViewTest(APITestCase):
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

    def test_food_list(self):
        food1 = Food.objects.create(name='Food 1', account=self.user,cal=100,amount_per_serving=100)
        food2 = Food.objects.create(name='Food 2', account=self.user,cal=200,amount_per_serving=200)
        
        # Food ListのエンドポイントにGETリクエストを送信
        url = ENDPOINT+'food/list/'
        response = self.client.get(url)
        # リクエストが成功したことを確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータを取得
        data = response.data
        # foodsが含まれていることを確認
        self.assertIn('foods', data)
        
        # foodsリストが正しくシリアライズされていることを確認
        serialized_foods = data['foods']
        self.assertEqual(len(serialized_foods), 2)  
        self.assertEqual(serialized_foods[0]['name'], 'Food 2')  
        self.assertEqual(serialized_foods[1]['name'], 'Food 1')



# 3. Meal Create
class MealCreateViewTest(APITestCase):
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        
        self.url=ENDPOINT+'meal/create/'

    def test_meal_create_valid_data(self):
        # 有効なデータ
        valid_data = {
            'food': self.food.id,
            'serving': 1,
            'meal_date': '2023-12-22',
            'meal_type': 'breakfast'
        }

        # Meal Createのエンドポイントに有効なデータでPOSTリクエストを送信
        response = self.client.post(self.url, valid_data, format='json')
        # リクエストが成功したことを確認
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_meal_create_invalid_data(self):
        # 不正なデータ（servnig,gramsが抜けている、あるいは両方記録されてる。また、meal_typeが不適切）
        invalid_data = {
            'food': self.food.id,
            'grams':200,
            'serving':2,
            'meal_type':'xxx',
            'meal_date': '2023-12-22',
        }

        # Meal Createのエンドポイントに不正なデータでPOSTリクエストを送信
        response = self.client.post(self.url, invalid_data, format='json')
        # リクエストが失敗し、適切なエラーステータスが返されたことを確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
# 4. Meal By Date
class MealByDateViewTest(APITestCase):
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        
        self.url=ENDPOINT+'meals/date/'

        # Mealを作成
        self.meal_date = '2023-12-22'
        self.meal = Meal.objects.create(
            food=self.food,
            serving=1,
            meal_date=self.meal_date,
            account=self.user,
            meal_type='dinner',
        )

    def test_meal_by_date_valid_data(self):
        # 有効なデータ
        valid_data = {
            'meal_date': self.meal_date,
        }
        # MealByDateViewのエンドポイントに有効なデータでGETリクエストを送信
        response = self.client.get(self.url, valid_data, format='json')
        # リクエストが成功したことを確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 適切なMealが返されたことを確認
        self.assertEqual(len(response.data['meals']), 1)
        self.assertEqual(response.data['meals'][0]['id'], self.meal.id)

    def test_meal_by_date_invalid_data(self):
        # 不正なデータ（meal_dateが抜けている）
        invalid_data = {}
        # MealByDateViewのエンドポイントに不正なデータでGETリクエストを送信
        response = self.client.get(self.url, invalid_data, format='json')
        # リクエストが失敗し、適切なエラーステータスが返されたことを確認
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        

# 5. Meal Update
class MealUpdateViewTest(APITestCase):
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )

        # Mealを作成
        self.meal_date = '2023-12-22'
        self.meal = Meal.objects.create(
            food=self.food,
            serving=1,
            meal_date=self.meal_date,
            account=self.user,
            meal_type='dinner',
        )

    def test_update_meal(self):
        # 更新するデータ
        updated_data = {
            'serving': None,
            'grams': 200,
        }

        # MealUpdateViewのエンドポイントにPUTリクエストを送信
        response = self.client.put(ENDPOINT+f'meal/update/{self.meal.id}/', updated_data,format='json')

        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # データベースから最新のMealオブジェクトを取得
        updated_meal = Meal.objects.get(id=self.meal.id)

        # 期待される値と実際の値が一致するか確認
        self.assertEqual(updated_meal.serving, updated_data['serving'])
        self.assertEqual(updated_meal.grams, updated_data['grams'])



# 6. Meal Delete
class MealDeleteViewTest(APITestCase):
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )

        # Mealを作成
        self.meal_date = '2023-12-22'
        self.meal = Meal.objects.create(
            food=self.food,
            serving=1,
            meal_date=self.meal_date,
            account=self.user,
            meal_type='dinner',
        )

    def test_delete_meal(self):
        # MealDeleteViewのエンドポイントにDELETEリクエストを送信
        response = self.client.delete(ENDPOINT+f'meal/delete/{self.meal.id}/')
        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # データベースからMealオブジェクトが削除されているか確認
        with self.assertRaises(Meal.DoesNotExist):
            Meal.objects.get(id=self.meal.id)

    # def test_delete_meal_unauthorized(self):
    #     unauthorized_user_data = {
    #         'username': 'otheruser',
    #         'password': 'othersecurepassword',
    #         'email': 'otheruser@example.com',
    #         'name': 'other John Doe',
    #         'birthday': '2000-01-01',
    #         'sex': False,
    #         'email_check': True,
    #     }
    #     unauthorized_user = CustomUser.objects.create_user(unauthorized_user_data)
    #     self.client.login(username='otheruser', password='otherpassword')
    #     self.token, _ = Token.objects.get_or_create(user=self.user)
    #     self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
    #     # MealDeleteViewのエンドポイントにDELETEリクエストを送信
    #     response = self.client.delete(f'/path/to/meal/delete/{self.meal.id}/')

    #     # レスポンスのステータスコードが権限エラーであるか確認
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # データベースからMealオブジェクトが削除されていないことを確認
        # self.assertIsNotNone(Meal.objects.get(id=self.meal.id))
        
        
# 7. FatSecrete Food Search
# 8. create meal with FatSecrete 
# 9. get searched Meal History


# 10 latest meals by type
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        
        self.meal_type ='dinner'

        # Mealを作成
        self.meal_date = '2023-12-22'
        self.meal = Meal.objects.create(
            food=self.food,
            serving=1,
            meal_date=self.meal_date,
            account=self.user,
            meal_type=self.meal_type,
        )
        
        
        self.url = ENDPOINT+'meal/latest-meals/'

    def test_get_latest_exercise_by_type(self):
        response = self.client.get(self.url, {'meal_type': self.meal_type})
        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータが期待通りの形式か確認
        self.assertIn('meals', response.data)
        self.assertIsInstance(response.data['meals'], list)
        # レスポンスのデータに作成したExerciseが含まれているか確認
        self.assertEqual(len(response.data['meals']), 1)
        serialized_meal = GetMealSerializer(self.meal)
        self.assertIn(serialized_meal.data, response.data['meals'])
        





# 11. create meals with latest data by type
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

        # Foodを作成
        self.food = Food.objects.create(
            name='Test Food',
            amount_per_serving=100,
            cal=200,
            account=self.user,
        )
        
        self.meal_type ='dinner'

        # Mealを作成
        self.meal_date = '2023-12-22'
        self.meal = Meal.objects.create(
            food=self.food,
            serving=1,
            meal_date=self.meal_date,
            account=self.user,
            meal_type=self.meal_type,
        )
        
        self.url = ENDPOINT+'meal/create-latest/'

    def test_create_exercises_with_latest_history_by_type(self):
        # リクエストデータをセットアップ
        request_data = {
            'meal_type': self.meal_type,
            'meal_date': '2023-12-23',  
        }

        response = self.client.post(self.url, request_data)

        # レスポンスのステータスコードが正しいか確認
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # レスポンスのデータが期待通りの形式か確認
        self.assertIn('meals', response.data)
        
        new_meal = Meal.objects.get(meal_date='2023-12-23')
        serialized_new_meal = GetMealSerializer(new_meal)
        # print('新規',serialized_new_meal.data)