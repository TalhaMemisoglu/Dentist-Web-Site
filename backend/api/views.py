from rest_framework import generics, permissions,status
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated , AllowAny
from django.contrib.auth import authenticate,login
from django.contrib.messages import get_messages
from django.http import JsonResponse
from .models import CustomUser, Profile
from .serializers import CustomUserSerializer, ProfileSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

#Need to decide whether to use Token or JWT!!!!


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Handle user registration
        response = super().create(request, *args, **kwargs)

        # Get the created user
        user_data = response.data
        user = CustomUser.objects.get(username=user_data['username'])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Send back a success response with tokens
        success_message = f'Account created for {user.username}!'
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
        # Return the profile for the currently authenticated user
        return self.request.user.profile

# Login View
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Use the serializer to validate input
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Authenticate the user
            user = authenticate(username=username, password=password)

            if user is not None:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key,
                    "user_type": user.user_type
                })

            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # If serializer is not valid, return the error messages
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete the token associated with the authenticated user
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            return Response({"error": "No active session found."}, status=400)
        
        return Response({"message": "Successfully logged out."}, status=200)

class DentistListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request):
        dentists = CustomUser.objects.filter(user_type='dentist')
        serializer = CustomUserSerializer(dentists, many=True)
        return Response(serializer.data)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)