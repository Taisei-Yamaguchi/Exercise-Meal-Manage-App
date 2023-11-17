# urls.py
from django.urls import path
from .views import WeightDataAPIView,MuscleMassDataAPIView,BodyFatDataAPIView


urlpatterns = [
    path('weight-graph/', WeightDataAPIView.as_view(), name='weight-graph'),
    path('body_fat_percentage-graph/', BodyFatDataAPIView.as_view(), name='body_fat_percentage-graph'),
    path('muscle_mass-graph/', MuscleMassDataAPIView.as_view(), name='muscle_mass-graph'),
]
