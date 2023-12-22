from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date
import re
from django.core.exceptions import ValidationError


def validate_password(value):
    if not re.match('^(?=.*[a-zA-Z0-9]).{6,}$', value):
        raise ValidationError('Password must be at least 6 characters and contain only letters and numbers.')



class CustomUser(AbstractUser):
    """Extension User Model"""
    
    # name,birthday,sex は必須
    name=models.CharField(default='unkown',null=False,max_length=100)
    email = models.EmailField(unique=True, max_length=150)
    
    password = models.CharField(
        max_length=128,
        null=False,
        blank=False,
        validators=[validate_password]
    )
    
    birthday = models.DateField(default=date.today)
    sex = models.BooleanField(default=False) # 0 is male, 1 is female.
    
    picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    email_check = models.BooleanField(default=False, null=True, blank=True) #email_check
    password_reset_sent = models.DateTimeField(null=True, blank=True) #password reset tokenの有効期限を判定する
    
    class Meta:
        verbose_name_plural ='CustomUser'