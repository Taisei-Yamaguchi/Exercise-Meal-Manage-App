from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Extension User Model"""
    
    metabolism = models.FloatField(default=0.0)
    picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    sex = models.BooleanField(default=False) # 0 is male, 1 is female.
    
    class Meta:
        verbose_name_plural ='CustomUser'