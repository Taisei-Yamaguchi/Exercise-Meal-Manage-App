from django.urls import path
from .views import SignupAPIView,LoginView
from .views import LogoutView, ConfirmEmailAPIView,PasswordResetRequestAPIView,PasswordResetConfirmAPIView
urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('signup_confirmation/',ConfirmEmailAPIView.as_view(),name='signup_confirmation'),
    
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('reset_password_request/',PasswordResetRequestAPIView.as_view(),name='reset_password_request'),
    path('reset_password_confirm/',PasswordResetConfirmAPIView.as_view(),name="reset_password_confirm"),
    
]
