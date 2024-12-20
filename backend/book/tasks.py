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
        subject = "Randevu hatırlatması"
        message_body = (
            f"Sayın {appointment.patient.get_full_name()},\n\n"
            f"Bu, {appointment.dentist.get_full_name()} Dr. ile olan randevunuzun hatırlatmasıdır.\n"
            f"Tarih: {appointment.appointment_date}\n"
            f"Saat: {appointment.appointment_time.strftime('%H:%M')}\n\n"
            "Lütfen zamanında gelmeye özen gösteriniz.\n\n"
            "Teşekkür ederiz!"
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



@shared_task
def auto_cancel_past_appointments():
    """Automatically cancel past uncompleted appointments and notify patients"""
    past_appointments = Appointment.objects.filter(
        appointment_date__lt=now().date(),
        status__in=['scheduled', 'confirmed']
    )
    
    updated_count = 0
    for appointment in past_appointments:
        appointment.status = 'cancelled'
        appointment.save()
        updated_count += 1
        
        # Send cancellation notification
        try:
            send_mail(
                "Randevu iptali - Gelmediğiniz için",
                f"Sayın {appointment.patient.get_full_name()},\n\n"
                f"{appointment.appointment_date} tarihli"
                f"{appointment.appointment_time.strftime('%H:%M')} saatindeki "
                f"Dt. {appointment.dentist.get_full_name()} ile olan randevunuz iptal edilmiştir.\n\n "
                f"Tekrar randevu oluşturmak için web sitemizden faydalanabilirsiniz.\n\n"
                f"Anlayışınız için teşekkür ederiz, ve sağlıklı günler dileriz.",
                settings.DEFAULT_FROM_EMAIL,
                [appointment.patient.email],
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send cancellation email to {appointment.patient.email}: {e}")
    
    return f"Updated {updated_count} past appointments to cancelled"