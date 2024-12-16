import os
from celery import shared_task
from django.utils.timezone import now, timedelta
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment

@shared_task
def send_appointment_reminders():
    # Fetch appointments occurring in the next hour
    one_hour_from_now = now() + timedelta(hours=1)
    appointments = Appointment.objects.filter(
        appointment_date=one_hour_from_now.date(),
        appointment_time__range=(one_hour_from_now.time(), (one_hour_from_now + timedelta(minutes=59)).time()),
        status__in=['scheduled', 'confirmed']
    )

    for appointment in appointments:
        patient_email = appointment.patient.email
        subject = "Appointment Reminder"
        message_body = (
            f"Dear {appointment.patient.get_full_name()},\n\n"
            f"This is a reminder for your appointment with Dr. {appointment.dentist.get_full_name()}.\n"
            f"Date: {appointment.appointment_date}\n"
            f"Time: {appointment.appointment_time.strftime('%H:%M')}\n\n"
            "Please ensure you arrive on time.\n\n"
            "Thank you!"
        )

        # Send the email using Django's send_mail function
        try:
            send_mail(
                subject,  # Subject of the email
                message_body,  # Email body
                settings.DEFAULT_FROM_EMAIL,  # From email address
                [patient_email],  # To email address
                fail_silently=False  # Raise error if sending fails
            )
        except Exception as e:
            print(f"Failed to send email to {patient_email}: {e}")