# urls.py
from django.urls import path
from .views import WorkoutListView,WorkoutCreateView,ExerciseCreateView,ExerciseGetByDateView

urlpatterns = [
    path('get-workout/', WorkoutListView.as_view(), name='get-workout'),
    path('post-workout/', WorkoutCreateView.as_view(), name='post-workout'),
    path('post-exercise/', ExerciseCreateView.as_view(), name='post-exercise'),
    path('get-exercise-date/', ExerciseGetByDateView.as_view(), name='get-exercise-date'),
    
]
