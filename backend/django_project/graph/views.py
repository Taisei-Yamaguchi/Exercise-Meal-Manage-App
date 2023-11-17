# views.py

from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user_info.models import UserInfo
from .serializers import WeightDataSerializer,BodyFatDataSerializer,MuscleMassDataSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, date



# weight data for creating weight graph. weightの毎日の変化を折れ線グラフにする。
# latest_target_weightをグラフに表示。グラフ作成はreactで行う。
class WeightDataAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)  # ユーザーに関連するデータを取得

        # # データがない場合の処理
        if not user_info.exists():
            return Response({'weight_data':[],'latest_target_weight':None}, status=status.HTTP_200_OK)

        # 日付、体重のデータを取得
        weight_data = list(UserInfo.objects.filter(account=request.user).values('date', 'weight'))

        
        # 補完用のデータを生成
        interpolated_data = []
        # 現在の日付を取得
        today = date.today()
        
        # 最初の日付から今日までの日数
        days_diff = (today - weight_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = weight_data[0]['date'] + timedelta(days=j)

            # 既にデータがある場合はスキップ
            if missing_date not in [entry['date'] for entry in weight_data]:
                interpolated_data.append({'date': missing_date, 'weight': None})

                
        # 補完データを元のデータに結合
        weight_data.extend(interpolated_data)
        
        # 日付でリストをソート
        weight_data.sort(key=lambda x: x['date'])

        # 最新の目標体重を取得
        latest_traget_weight = user_info.latest('date').target_weight

        # シリアライズしてレスポンス
        serialized_data = WeightDataSerializer(weight_data, many=True).data

        return Response({'weight_data':serialized_data,'latest_target_weight':latest_traget_weight}, status=status.HTTP_200_OK)
    





class BodyFatDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'body_fat_data': [], 'latest_body_fat_target': None}, status=status.HTTP_200_OK)

        body_fat_data = list(UserInfo.objects.filter(account=request.user).values('date', 'body_fat_percentage'))

        interpolated_data = []
        today = date.today()
        days_diff = (today - body_fat_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = body_fat_data[0]['date'] + timedelta(days=j)
            if missing_date not in [entry['date'] for entry in body_fat_data]:
                interpolated_data.append({'date': missing_date, 'body_fat_percentage': None})

        body_fat_data.extend(interpolated_data)
        body_fat_data.sort(key=lambda x: x['date'])

        #　ここで最新のbody_fatの目標を取得
        latest_body_fat_target = user_info.latest('date').target_body_fat_percentage

        serialized_data = BodyFatDataSerializer(body_fat_data, many=True).data

        return Response({'body_fat_data': serialized_data, 'latest_body_fat_target': latest_body_fat_target},
                        status=status.HTTP_200_OK)
        
        
        
        
        
class MuscleMassDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_info = UserInfo.objects.filter(account=request.user)

        if not user_info.exists():
            return Response({'muscle_mass_data': [], 'latest_muscle_mass_target': None}, status=status.HTTP_200_OK)

        muscle_mass_data = list(UserInfo.objects.filter(account=request.user).values('date', 'muscle_mass'))

        interpolated_data = []
        today = date.today()
        days_diff = (today - muscle_mass_data[0]['date']).days

        for j in range(1, days_diff + 1):
            missing_date = muscle_mass_data[0]['date'] + timedelta(days=j)
            if missing_date not in [entry['date'] for entry in muscle_mass_data]:
                interpolated_data.append({'date': missing_date, 'muscle_mass': None})

        muscle_mass_data.extend(interpolated_data)
        muscle_mass_data.sort(key=lambda x: x['date'])

        # MuscleMassDataAPIViewではmuscle_mass_targetが存在しないためNoneとします
        latest_muscle_mass_target = user_info.latest('date').target_muscle_mass

        serialized_data = MuscleMassDataSerializer(muscle_mass_data, many=True).data

        return Response({'muscle_mass_data': serialized_data, 'latest_muscle_mass_target': latest_muscle_mass_target},
                        status=status.HTTP_200_OK)