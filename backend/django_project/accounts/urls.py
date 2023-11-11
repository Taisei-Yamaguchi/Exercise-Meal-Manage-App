from django.urls import path
from .views import CustomUserCreateView, CustomUserList,SignupAPIView,LoginView
from .views import LogoutView, ConfirmEmailAPIView,PasswordResetRequestAPIView,PasswordResetConfirmAPIView
urlpatterns = [
    path('create/', CustomUserCreateView.as_view(), name='user-create'),
    path('list/', CustomUserList.as_view(), name='customuser-list'),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    # path('auth/', UserAuthenticationView.as_view(), name='user-authentication'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup_confirmation/',ConfirmEmailAPIView.as_view(),name='signup_confirmation'),
    path('reset_password_request/',PasswordResetRequestAPIView.as_view(),name='reset_password_request'),
    path('reset_password_confirm/',PasswordResetConfirmAPIView.as_view(),name="reset_password_confirm"),
    
]
