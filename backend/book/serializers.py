from django.forms import ValidationError
from rest_framework import serializers
from .models import Appointment
from api.models import CustomUser

class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'phone']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    dentist_name = serializers.CharField(source='dentist.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'dentist', 'dentist_name',
            'appointment_date', 'appointment_time', 'duration', 
            'status', 'notes', 'created_at'
        ]
        read_only_fields = ['id','patient_name','created_at']

    def validate(self, data):
        print("\n=== Serializer validate method ===")
        print(f"Incoming data: {data}")
        
        try:
            appointment = Appointment(**data)
            print("Created appointment instance for validation")
            appointment.clean()
            print("Appointment validation passed")
            return data
        except ValidationError as e:
            print(f"Validation error: {str(e)}")
            raise serializers.ValidationError(str(e))