from django.urls import path
from .views import MealAccessView,FoodPostView,FoodListView

urlpatterns = [
    path('meals/', MealAccessView.as_view(), name='meal-access'),
    path('food/post/', FoodPostView.as_view(), name='food-post'),
    path('food/list/', FoodListView.as_view(), name='food-get'),
]
