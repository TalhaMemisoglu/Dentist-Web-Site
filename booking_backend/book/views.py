from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .models import Appointment
from .forms import PatientTypeForm, AppointmentForm


def home(request):
    return render(request, 'home.html')


def patient_type_selection(request):
    """
    View to handle patient type selection (new/returning).
    GET: Displays the selection form
    POST: Processes the form and redirects based on selection
    """
    if request.method == 'POST':
        form = PatientTypeForm(request.POST)
        if form.is_valid():
            patient_type = form.cleaned_data['patient_type']
            # Redirect based on patient type
            if patient_type == 'new':
                return redirect('accounts:register')
            else:
                return redirect('accounts:login')
    else:
        # Create new form for GET request
        form = PatientTypeForm()
    return render(request, 'book/patient_type.html', {'form': form})

@login_required  # Ensures user is logged in to access this view
def appointment_booking(request):
    """
    View to handle appointment booking.
    GET: Displays the booking form
    POST: Processes the form and creates appointment
    """
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            # Create appointment but don't save to DB yet
            appointment = form.save(commit=False)
            # Set the patient to current user
            appointment.patient = request.user
            # Save the appointment to DB
            appointment.save()
            # Add success message
            messages.success(request, 'Appointment booked successfully!')
            return redirect('appointment_confirmation')
    else:
        # Create new form for GET request
        form = AppointmentForm()
    return render(request, 'book/appointment_form.html', {'form': form})

@login_required
def appointment_confirmation(request, appointment_id):
    """
    View to display appointment confirmation details
    """
    appointment = get_object_or_404(Appointment, id=appointment_id, patient=request.user)
    return render(request, 'book/appointment_confirmation.html', {
        'appointment': appointment
    })

@login_required
def my_appointments(request):
    """
    View to display user's appointments
    """
    appointments = Appointment.objects.filter(patient=request.user).order_by('appointment_date', 'appointment_time')
    today = timezone.now().date()
    return render(request, 'book/my_appointments.html', {
        'appointments': appointments,
        'today': today
    })
