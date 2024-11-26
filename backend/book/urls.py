from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DentistViewSet, AppointmentViewSet

# API Router setup
router = DefaultRouter()
router.register(r'dentists', DentistViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointment')

# User URLs
urlpatterns = [
   #TODO 
]