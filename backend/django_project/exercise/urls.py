# urls.py
from django.urls import path
from .views import WorkoutListView,WorkoutCreateView,ExerciseCreateView,ExerciseGetByDateView
from .views import ExerciseUpdateView,ExerciseDeleteView

urlpatterns = [
    path('get-workout/', WorkoutListView.as_view(), name='get-workout'),
    path('post-workout/', WorkoutCreateView.as_view(), name='post-workout'),
    path('post-exercise/', ExerciseCreateView.as_view(), name='post-exercise'),
    path('get-exercise-date/', ExerciseGetByDateView.as_view(), name='get-exercise-date'),
    path('exercise/update/<int:exercise_id>/', ExerciseUpdateView.as_view(), name='exercise-update'),
    path('exercise/delete/<int:pk>/', ExerciseDeleteView.as_view(), name='exercise-delete'),
    
]
