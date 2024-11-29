from django.urls import path
from .views import CreateUserView, ProfileView, LoginView, LogoutView, DentistListView
from .views import CurrentUserView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('dentists/', DentistListView.as_view(), name='dentist-list'),
    path('user/', CurrentUserView.as_view(), name='current-user'),

]
