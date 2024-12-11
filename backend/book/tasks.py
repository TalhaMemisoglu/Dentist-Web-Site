import os
from celery import shared_task
from django.utils.timezone import now, timedelta
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
from .models import Appointment
from django.conf import settings

@shared_task
def send_appointment_reminders():
    # Fetch appointments occurring in the next hour
    one_hour_from_now = now() + timedelta(hours=1)
    appointments = Appointment.objects.filter(
        appointment_date=one_hour_from_now.date(),
        appointment_time__range=(one_hour_from_now.time(), (one_hour_from_now + timedelta(minutes=59)).time()),
        status__in=['scheduled', 'confirmed']
    )

    # Load Gmail credentials
    token_path = os.path.join(settings.BASE_DIR, 'token.json')
    if not os.path.exists(token_path):
        raise FileNotFoundError("Token file not found. Authenticate with Google first.")

    creds = Credentials.from_authorized_user_file(token_path, settings.GMAIL_API_SCOPES)
    service = build('gmail', 'v1', credentials=creds)

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

        # MIME encode the message
        mime_message = MIMEText(message_body)
        mime_message['to'] = patient_email
        mime_message['subject'] = subject
        encoded_message = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()

        # Send the email
        try:
            service.users().messages().send(
                userId='me',
                body={'raw': encoded_message}
            ).execute()
        except Exception as e:
            print(f"Failed to send email to {patient_email}: {e}")
