from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # API Views
    DentistViewSet,
    OperationViewSet,
    AppointmentViewSet,
    
)

# API Router setup
router = DefaultRouter()
router.register(r'dentists', DentistViewSet)
router.register(r'operations', OperationViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointment')

# User URLs
urlpatterns = [
    # API endpoints
    path('api/', include(router.urls)),
    
    # Additional custom API endpoints if needed
    path('api/dentists/<int:pk>/available-slots/', 
         DentistViewSet.as_view({'get': 'available_slots'}),
         name='dentist-available-slots'),
         
    path('api/appointments/upcoming/',
         AppointmentViewSet.as_view({'get': 'upcoming'}),
         name='appointment-upcoming'),
         
    path('api/appointments/past/',
         AppointmentViewSet.as_view({'get': 'past'}),
         name='appointment-past'),
         
    path('api/appointments/today/',
         AppointmentViewSet.as_view({'get': 'today'}),
         name='appointment-today'),
         
    path('api/appointments/<int:pk>/cancel/',
         AppointmentViewSet.as_view({'post': 'cancel'}),
         name='appointment-cancel'),
]