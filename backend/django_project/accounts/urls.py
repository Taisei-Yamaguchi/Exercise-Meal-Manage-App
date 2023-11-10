from django.urls import path
from .views import CustomUserCreateView, CustomUserList,SignupAPIView,LoginView,UserAuthenticationView

urlpatterns = [
    path('create/', CustomUserCreateView.as_view(), name='user-create'),
    path('list/', CustomUserList.as_view(), name='customuser-list'),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/', UserAuthenticationView.as_view(), name='user-authentication'),
]
