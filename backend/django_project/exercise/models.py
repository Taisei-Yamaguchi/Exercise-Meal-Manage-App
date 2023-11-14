from django.db import models
from accounts.models import CustomUser
from django.core.exceptions import ValidationError

# Workout Model
class Workout(models.Model):
    WORKOUT_TYPES = [
        ('Aerobic', 'Aerobic'),
        ('Chest', 'Chest'),
        ('Shoulder', 'Shoulder'),
        ('Back', 'Back'),
        ('Leg', 'Leg'),
        ('Arm', 'Arm'),
        ('Abs', 'Abs'),
        ('Other', 'Other'),
        # Add more workout types as needed
    ]

    
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPES)

    def __str__(self):
        return self.name

# Exercise Model
class Exercise(models.Model):
    
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exercise_date = models.DateField()
    
    # どちらか片方だけの入力を許容する
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True, blank=True)
    default_workout = models.JSONField(null=True, blank=True)
    
    # workout_typeが筋トレである場合
    sets = models.PositiveIntegerField(default=1,null=True, blank=True)
    reps = models.PositiveIntegerField(default=1,null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # workout_typeがaeroである場合
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    distance = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    mets = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    memos = models.TextField(blank=True,null=True)

    def __str__(self):
        return f"Exercise {self.id} ({self.account.name}) on {self.exercise_date}"
    
    def clean(self):
        # workout と default_workout のどちらか一方が必要
        if self.workout is None and self.default_workout is None:
            raise ValidationError("Either 'workout' or 'default_workout' must be provided.")
        
        # workout と default_workout のどちらか一方しか指定できない
        if self.workout and self.default_workout:
            raise ValidationError("Only one of 'workout' or 'default_workout' should be provided.")

        