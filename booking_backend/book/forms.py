from django import forms
from .models import Appointment, Location, Operation

class PatientTypeForm(forms.Form):
    """
    Form to determine if the patient is new or returning.
    Uses radio buttons for selection.
    """
    PATIENT_CHOICES = [
        ('new', 'New Patient'),
        ('returning', 'Returning Patient'),
    ]
    patient_type = forms.ChoiceField(choices=PATIENT_CHOICES, widget=forms.RadioSelect)

class AppointmentForm(forms.ModelForm):
    """
    Form for booking appointments.
    Includes custom widgets for date and time selection.
    """
    # Custom date input widget with HTML5 date picker
    appointment_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    # Custom time input widget with HTML5 time picker
    appointment_time = forms.TimeField(widget=forms.TimeInput(attrs={'type': 'time'}))
    
    class Meta:
        model = Appointment
        fields = ['location', 'operation', 'appointment_date', 'appointment_time']