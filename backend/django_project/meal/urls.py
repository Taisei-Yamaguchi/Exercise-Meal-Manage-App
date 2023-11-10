from django.urls import path
from .views import MealAccessView

urlpatterns = [
    path('meals/', MealAccessView.as_view(), name='meal-access'),
]
