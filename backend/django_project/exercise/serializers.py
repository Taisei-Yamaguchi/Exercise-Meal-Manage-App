# serializers.py
from rest_framework import serializers
from .models import Workout,Exercise

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
        


class GetExerciseSerializer(serializers.ModelSerializer):
    
    # This setting is inappropriate because when saving exercise, the workout field is required to be json as well.
    # Create a separate one for post.
    workout = WorkoutSerializer(required=True)
    class Meta:
        model = Exercise
        fields = '__all__'
        


class POSTExerciseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Exercise
        fields = '__all__'
        
        
    def validate(self, data):
        """
        バリデーションメソッドをオーバーライドし、適切なバリデーションを追加します。
        """
        duration_minutes = data.get('duration_minutes')
        sets = data.get('sets')
        reps = data.get('reps')

        # duration_minutes、sets、repsがすべてnullの場合はエラーとします
        if duration_minutes is None and (sets is None or reps is None):
            raise serializers.ValidationError("Either 'duration_minutes', 'sets', or 'reps' must be provided.")

        return data


