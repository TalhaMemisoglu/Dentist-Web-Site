from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser, Profile
from .serializers import CustomUserSerializer, ProfileSerializer, LoginSerializer,UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction


# Email Verification View
class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            print(f"GET request for user_id={user_id}")
            user = get_object_or_404(CustomUser, id=user_id)
            print(f"User before update: {user.email}, Verified={user.verified}")

            if user.verified:
                return Response({"message": "Email is already verified!"}, status=status.HTTP_200_OK)

            user.verified = True
            user.save()
            print(f"User after update: {user.email}, Verified={user.verified}")

            return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# User Registration View with Email Verification
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user_data = response.data
        user = CustomUser.objects.get(email=user_data['email'])

        user.verified = False
        user.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        verification_link = f"{settings.FRONTEND_URL}/verify-email/{user.id}"
        subject = "Verify Your Email Address"
        message = f"Click the link to verify your email: {verification_link}"

        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        success_message = f'Account created for {user.username}! Please verify your email.'
        return Response({
            'message': success_message,
            'user': user_data,
            'access_token': access_token,
            'refresh_token': str(refresh),
        }, status=status.HTTP_201_CREATED)


# Custom Token Obtain Pair View for Email Authentication
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginSerializer  # Use the LoginSerializer to authenticate by email and password


# Login View with Email and Password Authentication
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Debugging: Print email and password
            print("Attempting to authenticate user:", email)

            # Use Django's default authenticate method for email/password login
            user = authenticate(request, username=email, password=password)

            # Debugging: Check if user is authenticated
            if user:
                print(f"User {email} authenticated successfully.")  # Print user info if authentication is successful
                if not user.verified:
                    return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_400_BAD_REQUEST)

                # Generate tokens
                refresh = RefreshToken.for_user(user)

                # Debugging statement: Print the tokens to the console
                print("Access Token:", str(refresh.access_token))  # Print access token
                print("Refresh Token:", str(refresh))  # Print refresh token

                return Response({
                    "access": str(refresh.access_token),  # Update to 'access' instead of 'access_token'
                    "refresh": str(refresh),  # Update to 'refresh' instead of 'refresh_token'
                    "user_type": user.user_type,
                })
            else:
                print(f"Authentication failed for {email}.")  # Print if authentication fails

            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Logout View (if still needed)
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Profile Management Views
class ProfileView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)


# Dentist List View
class DentistListView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        dentists = CustomUser.objects.filter(user_type='dentist')
        serializer = CustomUserSerializer(dentists, many=True)
        return Response(serializer.data)


# Current User View
class CurrentUserView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Log the token received in the request header
        print(f"Received token: {request.headers.get('Authorization')}")  # Debug: Check the token
        user = request.user

        if not user.is_authenticated:
            print("User is not authenticated.")  # Debug: If user is not authenticated
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"Authenticated user: {user.email}")  # Debug: Print user info if authenticated
        
        serializer = UserSerializer(user)
        return Response(serializer.data)