from django.urls import path
from . import views

app_name = 'book'

# URL patterns for the booking app
urlpatterns = [
    # Path for patient type selection
    path('', views.patient_type_selection, name='patient_type'),
    # Path for appointment booking form
    path('booking/', views.appointment_booking, name='booking'),
    path('confirmation/<int:appointment_id>/', views.appointment_confirmation, name='confirmation'),
    path('my-appointments/', views.my_appointments, name='my_appointments'),
]