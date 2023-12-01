from django.urls import path
from .views import PetView

urlpatterns = [
    path('get-pet/', PetView.as_view(), name='get-pet'),
]

