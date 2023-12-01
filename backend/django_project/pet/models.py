from accounts.models import CustomUser
from django.db import models
from datetime import date

class Pet(models.Model):
    GROW_CHOICES = [
        ('Egg', 'Egg'),
        ('Egg2', 'Egg2'),
        ('Baby', 'Baby'),
        ('Child', 'Child'),
        ('Adult', 'Adult'),
    ]
    
    STATUS_CHOICES = [
        ('Fatting', 'Fatting'),
        ('Thin','Thin'),
        ('Muscular','Muscular')
    ]

    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    grow = models.CharField(max_length=10, choices=GROW_CHOICES, default='Egg')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Thin')
    pet_date = models.DateField(default=date.today)  # 関数呼び出しを関数オブジェクトに修正

    def __str__(self):
        return f'{self.account.username}\'s Pet'
