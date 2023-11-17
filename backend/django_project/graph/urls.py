# urls.py
from django.urls import path
from .views import WeightDataAPIView


urlpatterns = [
    path('weight-graph/', WeightDataAPIView.as_view(), name='weight-graph'),
]
