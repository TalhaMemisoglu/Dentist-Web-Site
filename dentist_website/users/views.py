from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from django.contrib.auth import login, authenticate
from .models import Profile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
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
        
    return render(request, 'users/index.html', {'form': form})

@csrf_exempt
def custom_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"success": True, "message": "Login successful"})
        else:
            return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "POST method required"}, status=400)

@login_required
def profile(request):    #Updating profile could be added but idk. Maybe for medical records in the future
    context = {
        'user': request.user,
        'profile': request.user.profile  # Assuming Profile is linked to User
    }
    user = request.user  # Get the currently logged-in user
    
    email = user.email  # Direct access to the email field in CustomUser
    phone = user.phone if hasattr(user, 'phone') else "No phone number provided"

    # Return the information as a response
    response = f"""
    Username: {user.username}
    Email: {email}
    Phone: {phone}
    """
    return HttpResponse(response)