from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Profile, CustomUser

class UserRegisterForm(UserCreationForm):
    
    #Can add email or phone fields
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password1', 'password2']