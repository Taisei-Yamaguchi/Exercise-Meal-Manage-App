from django.urls import path
from .views import UserInfoCreateOrUpdateView, LatestUserInfoView

urlpatterns = [
    path('create/', UserInfoCreateOrUpdateView.as_view(), name='user-info-create-update'),
    path('get_latest/', LatestUserInfoView.as_view(), name='latest-user-info'),
    # 他のURLパターンを追加する場合はここに追加
]
