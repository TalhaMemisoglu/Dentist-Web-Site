from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from book.views import DentistViewSet, AppointmentViewSet
from api.views import CreateUserView, ProfileView, LoginView, LogoutView, DentistListView,CurrentUserView

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
    path('admin/', admin.site.urls),
    path('api/register/', CreateUserView.as_view(), name='register'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/user/', CurrentUserView.as_view(), name='current-user'),
    path('api/dentists/', DentistListView.as_view(), name='dentist-list'),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),  # Optional, for DRF's browsable API login
    #The api-auth/ endpoint provides session-based login for DRF’s browsable API. It doesn’t align 
    #with JWT, which is stateless and doesn’t use sessions.
    #Removing it avoids confusion and enforces consistency in authentication across your project.
    path('api/booking/dentists/', dentist_list, name='dentist-list'),
    path('api/booking/dentists/<int:pk>/', dentist_detail, name='dentist-detail'),
    path('api/booking/dentists/<int:pk>/available_dates/', available_dates, name='available-dates'),
    path('api/booking/dentists/<int:pk>/available_slots/', available_slots, name='available-slots'),

    # Appointment endpoints
    path('api/booking/appointments/', appointment_list, name='appointment-list'),
    path('api/booking/appointments/<int:pk>/', appointment_detail, name='appointment-detail'),
    path('api/booking/appointments/<int:pk>/cancel/', cancel_appointment, name='cancel-appointment'),
    path('api/booking/appointments/upcoming/', upcoming_appointments, name='upcoming-appointments'),
]
