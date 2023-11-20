from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class CustomUser(AbstractUser):
    """Extension User Model"""
    
    # name,birthday,sex は必須
    name=models.CharField(default='unkown',null=False,max_length=100)
    birthday = models.DateField(default=date.today)
    sex = models.BooleanField(default=False) # 0 is male, 1 is female.
    
    picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    email_check = models.BooleanField(default=False, null=True, blank=True) #email_check
    password_reset_sent = models.DateTimeField(null=True, blank=True) #password reset tokenの有効期限を判定する
    
    class Meta:
        verbose_name_plural ='CustomUser'