# serializers.py

from rest_framework import serializers
from user_info.models import UserInfo

class WeightDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    weight = serializers.FloatField()
    

    def to_representation(self, instance):
        # シリアライズするデータを制御
        return {
            'date': instance['date'],
            'weight': instance['weight'],
            
        }

