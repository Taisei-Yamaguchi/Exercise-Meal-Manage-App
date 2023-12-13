from django.db import models
from accounts.models import CustomUser
from django.core.validators import MinValueValidator


class Goal(models.Model):
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーに関連付ける外部キー
    
    goal_intake_cals = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    goal_consuming_cals = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    
    goal_weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    goal_body_fat = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    goal_muscle_mass = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    
    weekly_goal_chest = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    weekly_goal_leg = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    weekly_goal_shoulder = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    weekly_goal_arm = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    weekly_goal_back = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    weekly_goal_abs = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])

    def __str__(self):
        return f"Goal for {self.account.username}"
