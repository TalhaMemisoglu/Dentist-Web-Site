from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import Profile, CustomUser

class UserRegisterForm(UserCreationForm):
    
    email = forms.EmailField(required=False)  # Optional field
    phone = forms.CharField(max_length=15, required=False)
    
    class Meta:
        model = CustomUser
        fields = ['username','email','phone', 'password1', 'password2']
        
    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        phone = cleaned_data.get("phone")

        # Check if at least one of email, or phone is provided
        if not email and not phone:
            raise ValidationError("Please provide at least one of email, or phone.")
        
        return cleaned_data