from rest_framework import serializers
from .models import Dentist, Operation, DentistOperation, DentistSchedule, Appointment

class DentistSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Dentist
        fields = ['id', 'full_name', 'specialization', 'experience_years', 
                 'bio', 'profile_image', 'is_active']

class OperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operation
        fields = ['id', 'name', 'description', 'duration', 'price', 'is_active']

class DentistOperationSerializer(serializers.ModelSerializer):
    operation_details = OperationSerializer(source='operation', read_only=True)
    final_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, source='get_final_price', read_only=True
    )

    class Meta:
        model = DentistOperation
        fields = ['id', 'operation', 'operation_details', 'price_adjustment', 
                 'final_price', 'is_active']

class DentistScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = DentistSchedule
        fields = ['id', 'day_of_week', 'day_name', 'start_time', 'end_time', 'is_active']

class AppointmentSerializer(serializers.ModelSerializer):
    dentist_details = DentistSerializer(source='dentist', read_only=True)
    operation_details = OperationSerializer(source='operation', read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'dentist', 'dentist_details',
            'operation', 'operation_details', 'appointment_date', 
            'appointment_time', 'duration', 'status', 'notes', 'created_at'
        ]
        read_only_fields = ['patient', 'duration', 'status', 'created_at']

    def validate(self, data):
        try:
            appointment = Appointment(
                patient=self.context['request'].user,
                dentist=data['dentist'],
                operation=data['operation'],
                appointment_date=data['appointment_date'],
                appointment_time=data['appointment_time']
            )
            appointment.clean()
        except ValidationError as e:
            raise serializers.ValidationError(str(e))

        return data
