from django.urls import path, include
from .views import CreateUserView, ProfileView, LoginView, LogoutView, DentistListView,CurrentUserView,VerifyEmailView,UpdatePasswordView,UpdateUserProfileView
from book.views import AppointmentViewSet
from .views import PasswordResetRequestView, PasswordResetView
from rest_framework.routers import DefaultRouter    

router = DefaultRouter()
router.register(r'appointment', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateUserProfileView.as_view(), name='update-profile'),
    path('profile/change-password/', UpdatePasswordView.as_view(), name='change-password'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('dentists/', DentistListView.as_view(), name='dentist-list'),
    path('verify-email/<int:user_id>/', VerifyEmailView.as_view(), name='verify-email'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/<str:uid>/<str:token>/', PasswordResetView.as_view(), name='password_reset'),

    path('', include(router.urls)),
]
