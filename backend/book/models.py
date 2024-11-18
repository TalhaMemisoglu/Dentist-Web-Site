from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class Dentist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField()
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='dentists/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dt. {self.user.get_full_name()}"

    class Meta:
        ordering = ['user__first_name', 'user__last_name']

class Operation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in minutes")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class DentistOperation(models.Model):
    dentist = models.ForeignKey(Dentist, on_delete=models.CASCADE, related_name='operations')
    operation = models.ForeignKey(Operation, on_delete=models.CASCADE)
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['dentist', 'operation']

    def get_final_price(self):
        return self.operation.price + self.price_adjustment

    def __str__(self):
        return f"{self.dentist} - {self.operation}"

class DentistSchedule(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    dentist = models.ForeignKey(Dentist, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['dentist', 'day_of_week']
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.dentist} - {self.get_day_of_week_display()}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dentist = models.ForeignKey(Dentist, on_delete=models.PROTECT)
    operation = models.ForeignKey(Operation, on_delete=models.PROTECT)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.appointment_date < timezone.now().date():
            raise ValidationError("Cannot book appointments in the past")

        # Verify dentist performs this operation
        if not DentistOperation.objects.filter(
            dentist=self.dentist, 
            operation=self.operation,
            is_active=True
        ).exists():
            raise ValidationError("This dentist does not perform this operation")

        # Verify dentist's schedule
        schedule = DentistSchedule.objects.filter(
            dentist=self.dentist,
            day_of_week=self.appointment_date.weekday(),
            is_active=True
        ).first()

        if not schedule:
            raise ValidationError("Dentist is not available on this day")

        if (self.appointment_time < schedule.start_time or 
            self.appointment_time > schedule.end_time):
            raise ValidationError("Appointment time is outside dentist's working hours")

        # Check for overlapping appointments
        appointment_end = datetime.combine(self.appointment_date, self.appointment_time) + timedelta(minutes=self.duration)
        appointment_end_time = appointment_end.time()

        overlapping = Appointment.objects.filter(
            dentist=self.dentist,
            appointment_date=self.appointment_date,
            status__in=['scheduled', 'confirmed']
        ).exclude(pk=self.pk)

        for appt in overlapping:
            appt_end = datetime.combine(appt.appointment_date, appt.appointment_time) + timedelta(minutes=appt.duration)
            if (self.appointment_time <= appt.appointment_time and appointment_end_time > appt.appointment_time) or \
               (self.appointment_time < appt_end.time() and appointment_end_time >= appt_end.time()) or \
               (self.appointment_time >= appt.appointment_time and appointment_end_time <= appt_end.time()):
                raise ValidationError("This time slot overlaps with another appointment")

    def save(self, *args, **kwargs):
        if not self.duration:
            self.duration = self.operation.duration
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.operation.name} with {self.dentist}"

    class Meta:
        ordering = ['-appointment_date', 'appointment_time']