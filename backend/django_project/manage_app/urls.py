from django.urls import path
from .views import SampleAPIView

urlpatterns = [
    path('sample/', SampleAPIView.as_view(), name='sample-api'),
]
