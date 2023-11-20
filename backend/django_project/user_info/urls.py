from django.urls import path
from .views import UserInfoCreateOrUpdateView, LatestUserInfoView

urlpatterns = [
    path('create-update/', UserInfoCreateOrUpdateView.as_view(), name='user-info-create-update'),
    path('get-latest/', LatestUserInfoView.as_view(), name='user-info-get-latest'),
]
