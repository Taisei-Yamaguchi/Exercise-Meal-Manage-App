# urls.py
from django.urls import path
from .views import WeightDataAPIView,MuscleMassDataAPIView,BodyFatDataAPIView,ExerciseTotalWeightGraphDataAPIView
from .views import DailyNutrientsGraphDataAPIView,DailyExerciseWeightGraphDataAPIView


urlpatterns = [
    path('weight-graph/', WeightDataAPIView.as_view(), name='weight-graph'),
    path('body_fat_percentage-graph/', BodyFatDataAPIView.as_view(), name='body_fat_percentage-graph'),
    path('muscle_mass-graph/', MuscleMassDataAPIView.as_view(), name='muscle_mass-graph'),
    path('total-weight-graph/', ExerciseTotalWeightGraphDataAPIView.as_view(), name='total-weight-graph'),
    path('daily-nutrients-graph/', DailyNutrientsGraphDataAPIView.as_view(), name='daily-nutrients-graph'),
    path('daily-total-weight-graph/', DailyExerciseWeightGraphDataAPIView.as_view(), name='daily-total-weight-graph'),
]
