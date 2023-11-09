from django.urls import path
from .views import CustomUserCreateView, CustomUserList,SampleAPIView

urlpatterns = [
    path('create/', CustomUserCreateView.as_view(), name='user-create'),
    path('list/', CustomUserList.as_view(), name='customuser-list'),
    path('sample/', SampleAPIView.as_view(), name='sample-test'),
]
