from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile, CustomUser

@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):    #explicitly sending the email and phone
    if created:
        Profile.objects.create(
            user=instance,
            email=instance.email,  # Pass email from CustomUser
            phone=instance.phone,  # Pass phone from CustomUser
        )


@receiver(post_save, sender=CustomUser)
def save_profile(sender, instance, **kwargs):   #After changing the profile
    instance.profile.save()