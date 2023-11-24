# urls.py
from django.urls import path
from .views import RegistrationStatusCheckView

urlpatterns = [
    path('registration-status-check/', RegistrationStatusCheckView.as_view(), name='registration-status-check'),
]