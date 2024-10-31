from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from django.contrib.auth import login, authenticate
from .models import Profile
from django.http import HttpResponse                    #Will be deleted later, just for testing

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            
            
            login(request, user)
            
            
            return redirect('profile')
    else:
        form = UserRegisterForm()
        
    return render(request, 'users/register.html', {'form': form})

@login_required
def profile(request):    #Updating profile could be added but idk. Maybe for medical records in the future
    context = {
        'user': request.user,
        'profile': request.user.profile  # Assuming Profile is linked to User
    }
    return HttpResponse(f'Username: {request.user.username}')