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
        read_only_fields = ['created_at']

    def validate(self, data):
        request = self.context.get('request')
        if request and request.user.user_type == 'patient':
            data['patient'] = request.user

        # print(f"Patient Name: {data['patient'].username}")
        
        appointment = Appointment(**data)
        # print(f"appointment: {appointment}")
        try:
            appointment.clean()
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return data