from django.db import models
from accounts.models import CustomUser
from django.core.validators import MinValueValidator

class UserInfo(models.Model):
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーに関連付ける外部キー
    date = models.DateField()  
    
    height = models.FloatField( validators=[MinValueValidator(1)],default=1)
    weight = models.FloatField( validators=[MinValueValidator(1)],default=1)
    
    body_fat_percentage = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    muscle_mass = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    metabolism = models.FloatField(validators=[MinValueValidator(1)],default=1)
    target_weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    target_body_fat_percentage = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    target_muscle_mass = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1)])
    

    def __str__(self):
        return f'{self.account.username} - {self.date}-UserInfo'

