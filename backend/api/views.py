from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate,login
from django.contrib.messages import get_messages
from django.http import JsonResponse
from .models import CustomUser, Profile
from .serializers import CustomUserSerializer, ProfileSerializer, LoginSerializer

# User Registration View
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Handle user registration
        response = super().create(request, *args, **kwargs)
        
        # Get the user from the request data
        user_data = response.data
        username = user_data.get('username')
        
        # Login the user after registration
        user = CustomUser.objects.get(username=username)
        login(request, user)
        
        # Create the profile for the new user
        profile_data = {
            'user': user.id,
            'name': user.username,  # Assuming username is used as the name
            'email': user.email,
            'phone': user.phone,
        }
        profile_serializer = ProfileSerializer(data=profile_data)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Send back a success response with a message
        success_message = f'Account created for {username}!'
        return Response({
            'message': success_message,
            'user': user_data,
            'profile': profile_serializer.data
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