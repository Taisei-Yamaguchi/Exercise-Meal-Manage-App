from django.urls import path
from .views import MealAccessView,FoodPostView,FoodListView
from .views import MealCreateView,MealByDateView

urlpatterns = [
    path('meals/', MealAccessView.as_view(), name='meal-access'),
    path('food/post/', FoodPostView.as_view(), name='food-post'),
    path('food/list/', FoodListView.as_view(), name='food-list'),
    path('meal/create/', MealCreateView.as_view(), name='meal-create'), 
    path('meals/date/',MealByDateView.as_view(), name='meal-date'),
]
