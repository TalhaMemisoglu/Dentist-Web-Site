from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("api.urls")),  # Includes all endpoints from the `api` app
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),  # Optional, for DRF's browsable API login
    #The api-auth/ endpoint provides session-based login for DRF’s browsable API. It doesn’t align 
    #with JWT, which is stateless and doesn’t use sessions.
    #Removing it avoids confusion and enforces consistency in authentication across your project.
    path('api/booking/', include('book.urls')) # Fuse with rest of API after further testing
]
