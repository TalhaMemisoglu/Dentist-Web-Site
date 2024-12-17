from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment


# Signal for sending email when an appointment is scheduled
@receiver(post_save, sender=Appointment)
def appointment_scheduled(sender, instance, created, **kwargs):
    if created:  # Only send notification if a new appointment is created
        subject = "Appointment Scheduled"
        message = (
            f"Dear {instance.patient.get_full_name()},\n\n"
            f"Your appointment with Dr. {instance.dentist.get_full_name()} has been scheduled.\n"
            f"Date: {instance.appointment_date}\n"
            f"Time: {instance.appointment_time.strftime('%H:%M')}\n\n"
            "Thank you for choosing us!"
        )
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # Sender email
            [instance.patient.email],  # Recipient email
            fail_silently=False,
        )


# Signal for sending email when an appointment is canceled
@receiver(pre_delete, sender=Appointment)
def appointment_canceled(sender, instance, **kwargs):
    subject = "Appointment Canceled"
    message = (
        f"Dear {instance.patient.get_full_name()},\n\n"
        f"Your appointment with Dr. {instance.dentist.get_full_name()} scheduled for {instance.appointment_date} "
        f"at {instance.appointment_time.strftime('%H:%M')} has been canceled.\n\n"
        "We apologize for any inconvenience."
    )
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,  # Sender email
        [instance.patient.email],  # Recipient email
        fail_silently=False,
    )