from django.urls import path
from .views import DentistViewSet, AppointmentViewSet

# Define views explicitly
dentist_list = DentistViewSet.as_view({'get': 'list'})
dentist_detail = DentistViewSet.as_view({'get': 'retrieve'})
available_dates = DentistViewSet.as_view({'get': 'available_dates'})
available_slots = DentistViewSet.as_view({'get': 'available_slots'})

appointment_list = AppointmentViewSet.as_view({'get': 'list', 'post': 'create'})
appointment_detail = AppointmentViewSet.as_view({'get': 'retrieve'})
cancel_appointment = AppointmentViewSet.as_view({'post': 'cancel'})
upcoming_appointments = AppointmentViewSet.as_view({'get': 'upcoming'})

urlpatterns = [
    # Dentist endpoints
    path('/dentists/', dentist_list, name='dentist-list'),
    path('/dentists/<int:pk>/', dentist_detail, name='dentist-detail'),
    path('/dentists/<int:pk>/available_dates/', available_dates, name='available-dates'),
    path('/dentists/<int:pk>/available_slots/', available_slots, name='available-slots'),

    # Appointment endpoints
    path('/appointments/', appointment_list, name='appointment-list'),
    path('/appointments/<int:pk>/', appointment_detail, name='appointment-detail'),
    path('/appointments/<int:pk>/cancel/', cancel_appointment, name='cancel-appointment'),
    path('/appointments/upcoming/', upcoming_appointments, name='upcoming-appointments'),
]