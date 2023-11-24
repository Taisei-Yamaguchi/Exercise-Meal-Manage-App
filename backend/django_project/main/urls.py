# urls.py
from django.urls import path
from .views import RegistrationStatusCheckView,CalsByDateView,PFCSumByDateView

urlpatterns = [
    path('registration-status-check/', RegistrationStatusCheckView.as_view(), name='registration-status-check'),
    path('cals-by-date/', CalsByDateView.as_view(), name='cals-by-date'),
    path('pfc-by-date/', PFCSumByDateView.as_view(), name='pfc-by-date'),
    
]