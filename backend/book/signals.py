from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment


# Signal for sending email when an appointment is scheduled
@receiver(post_save, sender=Appointment)
def appointment_scheduled(sender, instance, created, **kwargs):
    if created:  # Only send notification if a new appointment is created
        subject = "Randevu Oluşturuldu"
        message = (
        f"Sayın {instance.patient.get_full_name()},\n\n"
        f"Dr. {instance.dentist.get_full_name()} ile randevunuz planlanmıştır.\n"
        f"Tarih: {instance.appointment_date}\n"
        f"Saat: {instance.appointment_time.strftime('%H:%M')}\n\n"
        "Bizi tercih ettiğiniz için teşekkür ederiz!"
)
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # Sender email
            [instance.patient.email],  # Recipient email
            fail_silently=False,
        )


# Signal for sending email when an appointment is canceled
@receiver(post_save, sender=Appointment)
def send_email_on_status_change(sender, instance, **kwargs):
    print(f"Randevunun durumu değişti: {instance.status}")  # Sinyalin tetiklenip tetiklenmediğini kontrol edin
    if instance.status == 'cancelled':  # Statü 'canceled' olduğunda
        print("Randevu iptal e-postası gönderiliyor...")  # Bu kodun çalışıp çalışmadığını kontrol edin
        subject = "Randevu İptal Edildi"
        message = (
            f"Sayın {instance.patient.get_full_name()},\n\n"
            f"{instance.appointment_date} tarihinde saat {instance.appointment_time.strftime('%H:%M')} için "
            f"Dr. {instance.dentist.get_full_name()} ile olan randevunuz iptal edilmiştir.\n\n"
            "Verdiğimiz rahatsızlıktan dolayı özür dileriz."
        )
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # Gönderen e-posta
            [instance.patient.email],  # Alıcı e-posta
            fail_silently=False,
        )