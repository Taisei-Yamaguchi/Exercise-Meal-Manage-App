from django.urls import path
from .views import FoodPostView,FoodListView
from .views import MealCreateView,MealByDateView,MealUpdateView,MealDeleteView
from .views import FatSecretSearchAPIView,MealCreateWithFatSecretView,GetSearchedFoodHistoryView
from .views import GetLatestMealsByType,CreateMealsWithLatestHistoryByType

urlpatterns = [
    path('food/post/', FoodPostView.as_view(), name='food-post'),
    path('food/list/', FoodListView.as_view(), name='food-list'),
    path('meal/create/', MealCreateView.as_view(), name='meal-create'), 
    path('meals/date/',MealByDateView.as_view(), name='meal-date'),
    path('meal/update/<int:meal_id>/', MealUpdateView.as_view(), name='meal-update'),
    path('meal/delete/<int:pk>/', MealDeleteView.as_view(), name='meal-delete'),
    path('meal/food-search/', FatSecretSearchAPIView.as_view(), name='food-search'),
    path('meal/create-with-fatsecret/', MealCreateWithFatSecretView.as_view(), name='meal-create-with-fatsecret'),
    path('food/get-searched-food-history/', GetSearchedFoodHistoryView.as_view(), name='get-searched-food-history'),
    path('meal/latest-meals/', GetLatestMealsByType.as_view(), name='latest-meals'),
    path('meal/create-latest/', CreateMealsWithLatestHistoryByType.as_view(), name='create-latest'),
]

