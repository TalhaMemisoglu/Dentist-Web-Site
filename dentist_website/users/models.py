from django.db import models
from django.contrib.auth.models import User,AbstractUser


class CustomUser(AbstractUser):             #For custom user model which we will need for dentist patient and etc.
    USER_TYPES = (
        ('dentist', 'Dentist'),
        ('patient', 'Patient'),
        #('assistant','Assistant'),             #Will activate later
        #('manager','Manager'), 
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='patient')

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)   #Should be used
    name = models.CharField(max_length=200, null=True)                  #Should be used
    email = models.EmailField(max_length=200, null=True)                #IDK about this one there are old people who don't use email
    phone = models.CharField(max_length=200, null=True)                 #Definitely should be used for texting
    #date_created = models.DateTimeField(auto_now_add=True, null=True)   #Could be used idk
    
    def __str__(self):             #it will display the associated user's username followed by "Profile" when you print.
        return self.name if self.name else f"Profile of {self.user.username}"#return self.name
        
        
    def save(self, *args, **kwargs):    #This is a method that is called when an instance of a model is saved.
        if Profile.objects.filter(user=self.user).exists() and not self.pk:
            raise ValueError('A profile already exists for this user.')
        
        #Will add more features here later, Huge potential for this method
        
        super().save(*args, **kwargs)
