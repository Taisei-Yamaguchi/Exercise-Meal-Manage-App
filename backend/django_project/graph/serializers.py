# serializers.py
from rest_framework import serializers

class WeightDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    weight = serializers.FloatField()

    def to_representation(self, instance):
        # シリアライズするデータを制御
        return {
            'date': instance['date'],
            'weight': instance['weight'],
            
        }



class BodyFatDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    body_fat_percentage = serializers.FloatField()
    
    def to_representation(self, instance):
        # シリアライズするデータを制御
        return {
            'date': instance['date'],
            'body_fat_percentage': instance['body_fat_percentage'],
            
        }


class MuscleMassDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    muscle_mass = serializers.FloatField()
    
    def to_representation(self, instance):
        # シリアライズするデータを制御
        return {
            'date': instance['date'],
            'muscle_mass': instance['muscle_mass'],
            
        }
