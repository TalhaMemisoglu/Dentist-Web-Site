from django.db import models
from django.contrib.auth.models import User,AbstractUser
from django.core.exceptions import ValidationError


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
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)   #Should be used
    name = models.CharField(max_length=200, null=True)                  #Should be used
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)  #whether should be unique or not
    #date_created = models.DateTimeField(auto_now_add=True, null=True)   #Could be used idk
    
    def __str__(self):             #it will display the associated user's username followed by "Profile" when you print.
        return self.name if self.name else f"{self.user.username}"#return self.name
        
        
   #def save(self, *args, **kwargs):    #This is a method that is called when an instance of a model is saved.
        #Will add more features here later, Huge potential for this method

        
        
        super().save(*args, **kwargs)
