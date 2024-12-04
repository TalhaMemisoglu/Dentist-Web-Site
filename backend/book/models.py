from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta
from api.models import CustomUser

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_appointments')
    dentist = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='dentist_appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes", default=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        print("\n=== Appointment clean method ===")
        print(f"Cleaning appointment with data:")
        print(f"- Patient: {self.patient}")
        print(f"- Dentist: {self.dentist}")
        print(f"- Date: {self.appointment_date}")
        print(f"- Time: {self.appointment_time}")
        print(f"- Patient ID: {self.patient.id}")
        print(f"- Dentist ID: {self.dentist.id}")


        if self.appointment_date < timezone.now().date():
            raise ValidationError("Cannot book appointments in the past")

        if self.patient.user_type != 'patient':
            raise ValidationError("Only patients can book appointments")

        if self.dentist.user_type != 'dentist':
            raise ValidationError("Can only book appointments with dentists")

        if not self.is_time_available():
            raise ValidationError("This time slot is not available")

    def is_time_available(self):
        appointment_end = datetime.combine(
            self.appointment_date, 
            self.appointment_time
        ) + timedelta(minutes=self.duration)
        
        appointment_end_time = appointment_end.time()

        overlapping = Appointment.objects.filter(
            dentist=self.dentist,
            appointment_date=self.appointment_date,
            status__in=['scheduled', 'confirmed']
        ).exclude(pk=self.pk)

        for appt in overlapping:
            appt_end = datetime.combine(
                appt.appointment_date, 
                appt.appointment_time
            ) + timedelta(minutes=appt.duration)
            
            if (self.appointment_time <= appt.appointment_time and 
                appointment_end_time > appt.appointment_time) or \
               (self.appointment_time < appt_end.time() and 
                appointment_end_time >= appt_end.time()) or \
               (self.appointment_time >= appt.appointment_time and 
                appointment_end_time <= appt_end.time()):
                return False
        return True

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.get_full_name()} with Dt. {self.dentist.get_full_name()}"

    class Meta:
        ordering = ['-appointment_date', 'appointment_time']
