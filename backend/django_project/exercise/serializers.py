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
    
    # この設定だと、exerciseを保存する時にworkoutフィールドもjsonであることを求められてしまうので不適切。
    # post用に別に作る。
    workout = WorkoutSerializer(required=False)
    class Meta:
        model = Exercise
        fields = '__all__'
        


class POSTExerciseSerializer(serializers.ModelSerializer):
    
    # この設定だと、exerciseを保存する時にworkoutフィールドもjsonであることを求められてしまうので不適切。
    # post用に別に作る。
    
    class Meta:
        model = Exercise
        fields = '__all__'
        
        
        

