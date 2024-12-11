from rest_framework import serializers
from .models import CustomUser, Profile
from book.models import Appointment

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email','phone', 'password']
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
        
