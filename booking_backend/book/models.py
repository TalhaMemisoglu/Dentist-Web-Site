from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    """
    Model to store dental clinic locations.
    Each location has a name and address.
    """
    name = models.CharField(max_length=100)
    address = models.TextField()
    
    def __str__(self):
        """Returns string representation of the location"""
        return self.name

class Operation(models.Model):
    """
    Model to store different types of dental operations/procedures.
    Includes name, duration, and description of the procedure.
    """
    name = models.CharField(max_length=100)
    duration = models.IntegerField(help_text="Duration in minutes")
    description = models.TextField()
    
    def __str__(self):
        """Returns string representation of the operation"""
        return self.name

class Appointment(models.Model):
    """
    Model to store appointment information.
    Links patient, location, operation, and timing details.
    """
    # ForeignKey to User model for patient information
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    # ForeignKey to Location model to specify clinic
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    # ForeignKey to Operation model to specify procedure
    operation = models.ForeignKey(Operation, on_delete=models.CASCADE)
    # Date and time of appointment
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    # Automatically set when appointment is created
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Ensures no double booking for same location, date and time
        unique_together = ['location', 'appointment_date', 'appointment_time']