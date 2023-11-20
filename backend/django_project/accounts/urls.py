from django.urls import path
from .views import SignupAPIView,LoginView
from .views import LogoutView, SignUpConfirmEmailAPIView,PasswordResetRequestAPIView,PasswordResetConfirmAPIView
from .views import UpdateAccountView, GetAccountView

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('signup-confirmation/',SignUpConfirmEmailAPIView.as_view(),name='signup-confirmation'),
    
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('reset-password-request/',PasswordResetRequestAPIView.as_view(),name='reset-password-request'),
    path('reset-password-confirm/',PasswordResetConfirmAPIView.as_view(),name="reset-password-confirm"),
    
    path('update/',UpdateAccountView.as_view(),name="update-view"),
    path('get/',GetAccountView.as_view(),name="get-view"),
    
]
