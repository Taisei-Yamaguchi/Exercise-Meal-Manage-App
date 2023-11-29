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
    ]
    
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    
    #default_workoutをここに登録してしまう
    is_default = models.BooleanField(default=False)
    d_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name



# Exercise Model
class Exercise(models.Model):
    
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exercise_date = models.DateField()
    
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE) #必須
    
    # カロリー計算時、duration_minutesを優先、なければsets,repsを使う。
    sets = models.PositiveIntegerField(default=1,null=True, blank=True)
    reps = models.PositiveIntegerField(default=1,null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)
    duration_minutes = models.FloatField(null=True, blank=True)
    distance = models.FloatField( null=True, blank=True)
    mets = models.FloatField( null=True, blank=True)
    
    memos = models.TextField(blank=True,null=True)

    def __str__(self):
        return f"Exercise {self.id} ({self.account.name}) on {self.exercise_date} ---{self.workout.is_default}"
    
    def clean(self):
        # duration_minutes が null の場合、sets と reps は必須
        if self.duration_minutes is None and (self.sets is None or self.reps is None):
            raise ValidationError("If 'duration_minutes' is not provided, both 'sets' and 'reps' are required.")
