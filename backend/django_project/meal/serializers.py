from rest_framework import serializers
from .models import Meal,Food

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'
        
class MealSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Meal
        fields = '__all__'

