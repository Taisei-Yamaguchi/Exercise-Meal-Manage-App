from accounts.models import CustomUser
from django.db import models
from datetime import date

class Pet(models.Model):
    GROW_CHOICES = [
        ('Egg', 'Egg'),
        ('Egg2', 'Egg2'),
        ('Baby', 'Baby'),
        ('Baby2', 'Baby2'),
        ('Child', 'Child'),
        ('Child2', 'Child2'),
        ('Adult', 'Adult'),
        ('End', 'End'),
    ]
    
    STATUS_CHOICES = [
        ('Fatting', 'Fatting'),
        ('Semi-Fatting', 'Semi-Fatting'),
        ('Thin','Thin'),
        ('Semi-Thin','Semi-Thin'),
        ('Semi-Muscular','Semi-Muscular'),
        ('Muscular','Muscular'),
        ('Normal','Normal')
    ]

    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    grow = models.CharField(max_length=10, choices=GROW_CHOICES, default='Egg')
    body_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Thin')
    pet_date = models.DateField(default=date.today)  # 関数呼び出しを関数オブジェクトに修正

    def __str__(self):
        return f'{self.account.username}\'s Pet'
    
