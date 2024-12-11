from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser, Profile
from .serializers import CustomUserSerializer, ProfileSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404


# Email Verification View
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        try:
            # Get the user by ID
            user = get_object_or_404(get_user_model(), id=user_id)

            # Mark the user as verified
            if user.verified:
                return Response({"message": "Email is already verified!"}, status=status.HTTP_200_OK)

            user.verified = True
            user.save()

            return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# User Registration View with Email Verification
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user_data = response.data
        user = CustomUser.objects.get(email=user_data['email'])

        # Ensure the user is unverified initially
        user.verified = False
        user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Send email verification
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


# Profile Management Views
class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

#Login View
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)

            if user:
                if not user.verified:
                    return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_400_BAD_REQUEST)

                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key,
                    "user_type": user.user_type
                })

            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Logout View
class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            return Response({"error": "No active session found."}, status=400)

        return Response({"message": "Successfully logged out."}, status=200)


# Dentist List View
class DentistListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        dentists = CustomUser.objects.filter(user_type='dentist')
        serializer = CustomUserSerializer(dentists, many=True)
        return Response(serializer.data)


# Current User View
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
