from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class CustomUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields ='__all__'
    
    def validate(self, data):
        # email、password、usernameが変更されようとした場合はエラー
        if 'email' in data or 'password' in data or 'username' in data:
            raise serializers.ValidationError("You cannot change email, password, or username.")
        
        return data