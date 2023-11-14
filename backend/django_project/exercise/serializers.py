# serializers.py
from rest_framework import serializers
from .models import Workout,Exercise

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
        


class WExerciseSerializer(serializers.ModelSerializer):
    
    workout = WorkoutSerializer()
    class Meta:
        model = Exercise
        fields = '__all__'
        
        
        
class DExerciseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Exercise
        fields = '__all__'
        
        
        
class ExerciseSerializer(serializers.ModelSerializer):
    
    workout = WorkoutSerializer(required=False)
    class Meta:
        model = Exercise
        fields = '__all__'
        

