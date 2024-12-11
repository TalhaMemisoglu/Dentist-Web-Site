from django.db import models
from django.contrib.auth.models import User,AbstractUser
from django.core.exceptions import ValidationError
from book.models import Appointment


class CustomUser(AbstractUser):             #For custom user model which we will need for dentist patient and etc.
    USER_TYPES = (
        ('dentist', 'Dentist'),
        ('patient', 'Patient'),
        ('assistant','Assistant'),             
        ('manager','Manager'), 
    )

    # # get_full_name added
    # def get_full_name(self):
    #     return f"{self.first_name} {self.last_name}"
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='patient')
    phone = models.CharField(max_length=200, null=True, blank=True)  # Optional phone field
    email = models.EmailField(max_length=254,unique=True)  #required email field
    verified = models.BooleanField(default=False)  # Added verified field

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)  # Unique if needed
    appointments = models.ManyToManyField('Appointment', blank=True)

    def __str__(self):             
        return f"{self.first_name} {self.last_name}"
    
    def save(self, *args, **kwargs):    
        super().save(*args, **kwargs)