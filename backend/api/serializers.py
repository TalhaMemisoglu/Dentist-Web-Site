from rest_framework import serializers
from .models import CustomUser, Profile

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "phone", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):
        """
        Check if either email or phone is provided.
        """
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError("Either email or phone must be provided.")
        
        return data

    def create(self, validated_data):
        # Create the user first
        user = CustomUser.objects.create_user(**validated_data)
        
        # Now create the profile
        Profile.objects.create(user=user, email=validated_data.get('email'), phone=validated_data.get('phone'))

        return user
# Login Serializer    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        return data

# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user", "name", "email", "phone"]
        extra_kwargs = {
            "user": {"read_only": True},  # User will be assigned automatically
        }