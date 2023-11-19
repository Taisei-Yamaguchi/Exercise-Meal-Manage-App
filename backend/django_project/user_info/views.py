from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserInfo
from .serializers import UserInfoSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import datetime



# UserInfo Create pr Upadate
class UserInfoCreateOrUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    def post(self, request):
        user = self.request.user
        if user.is_authenticated:
            # Get the latest user info, if available
            try:
                latest_info = UserInfo.objects.filter(account=user).latest('date')
            except UserInfo.DoesNotExist:
                latest_info = None

            # frontendから取得したdateを適切な形に変換。
            date_from_request = request.data.get('date')
            date_from_request = datetime.strptime(date_from_request, '%Y-%m-%d').date()
            
            # Check if the latest info is available and its date matches with the provided date
            if latest_info and latest_info.date == date_from_request:
                # Update only the fields provided in the request
                if request.data['metabolism'] is None:
                    request.data['metabolism'] = calculate_metabolism(request.data['weight'], request.data['height'],user.sex,user.birthday)

                
                serializer = UserInfoSerializer(latest_info, data=request.data, partial=True)
            else:
                # Create a new user info entry using the provided data or latest info if not available
                data = {
                    'account': user.id,
                    'date': date_from_request,
                    'weight': request.data.get('weight'),
                    'height': request.data.get('height'),
                    'body_fat_percentage': request.data.get('body_fat_percentage'),
                    'muscle_mass': request.data.get('muscle_mass'),
                    'metabolism': request.data.get('metabolism'),
                    'target_weight': request.data.get('target_weight'),
                    'target_body_fat_percentage': request.data.get('target_body_fat_percentage'),
                    'target_muscle_mass': request.data.get('target_muscle_mass'),
                }
                
                
                if data['metabolism'] is None:
                    data['metabolism'] = calculate_metabolism(data['weight'], data['height'],user.sex,user.birthday)

                serializer = UserInfoSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


#metabolism 自動計算関数
def calculate_metabolism(weight, height,sex,birthday):
    # ここで基礎代謝の計算ロジックを実装
    today = datetime.today().date()
    age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
    # 変数をfloat型に変換
    weight = float(weight)
    height = float(height)
    age = float(age)

    # Mifflin-St Jeorの式を用いる
    if sex: #True 女のとき
        metabolism= 10 * weight + 6.25 * height - 5 * age - 161
    else: #False 男のとき
        metabolism = 10 * weight + 6.25 * height - 5 * age + 5

    return metabolism





    
#get latest user info
class LatestUserInfoView(APIView):
    permission_classes = [IsAuthenticated]  # ユーザーが認証されていることを確認
    def get(self, request):
        user = self.request.user
        if user.is_authenticated:
            try:
                latest_info = UserInfo.objects.filter(account=user).latest('date')
                serializer = UserInfoSerializer(latest_info)
                return Response(serializer.data)
            except UserInfo.DoesNotExist:
                # latest_infoが存在しない場合
                return Response({"message": "No user info available for the current user."}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
