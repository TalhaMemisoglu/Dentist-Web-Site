# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from book.models import Appointment
from .models import Profile,CustomUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','first_name', 'last_name', 'email','phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        # Create the user without username first
        user = CustomUser.objects.create(
            first_name=first_name,
            last_name=last_name,
            **validated_data
        )
        
        # Generate a username after user creation using the id field
        username = f"{first_name.lower()}{last_name.lower()}{user.id}"

        # Update the user's username with the generated value
        user.username = username
        user.set_password(validated_data['password'])
        user.save()

        return user
    
# Login Serializer    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        return data

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    dentist_name = serializers.CharField(source='dentist.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'dentist_name', 'appointment_date', 
            'appointment_time', 'duration', 'status', 'notes'
        ]

class ProfileSerializer(serializers.ModelSerializer):
    appointments = AppointmentSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'first_name','last_name', 'email', 'phone', 'appointments'
        ]
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name' ,'phone', 'email', 'user_type']
        

class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def save(self, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = get_user_model().objects.get(id=user_id)
        except (TypeError, ValueError, get_user_model().DoesNotExist):
            raise serializers.ValidationError("Invalid user ID or token.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token.")

        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = get_user_model().objects.get(email=value)
        except get_user_model().DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")
        return value
   

        

