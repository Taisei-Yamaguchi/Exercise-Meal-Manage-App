from django.urls import path
from .views import GoalCreateOrUpdateView,GetGoalView

urlpatterns = [
    path('create-update/', GoalCreateOrUpdateView.as_view(), name='goal-create-update'),
    path('get/', GetGoalView.as_view(), name='get-goal'),
]
