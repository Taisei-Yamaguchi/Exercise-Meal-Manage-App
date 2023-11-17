# views.py

from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user_info.models import UserInfo
from .serializers import WeightDataSerializer
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
    
