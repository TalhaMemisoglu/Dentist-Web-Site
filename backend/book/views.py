from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .models import (
    Dentist, Operation, DentistOperation,
    DentistSchedule, Appointment
)
from .serializers import (
    DentistSerializer, OperationSerializer,
    DentistOperationSerializer, DentistScheduleSerializer,
    AppointmentSerializer
)

class DentistViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing dentist information.
    Provides 'list' and 'retrieve' actions by default.
    Additional actions: operations, schedule, available_slots
    """
    queryset = Dentist.objects.filter(is_active=True)
    serializer_class = DentistSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True)
    def operations(self, request, pk=None):
        """Get all operations performed by this dentist"""
        dentist = self.get_object()
        operations = DentistOperation.objects.filter(
            dentist=dentist,
            is_active=True
        ).select_related('operation')
        
        serializer = DentistOperationSerializer(operations, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def schedule(self, request, pk=None):
        """Get dentist's working schedule"""
        dentist = self.get_object()
        schedule = DentistSchedule.objects.filter(
            dentist=dentist,
            is_active=True
        )
        serializer = DentistScheduleSerializer(schedule, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def available_slots(self, request, pk=None):
        """Get available time slots for a specific date and operation"""
        dentist = self.get_object()
        date_str = request.query_params.get('date')
        operation_id = request.query_params.get('operation')
        
        # Validate parameters
        if not date_str or not operation_id:
            return Response(
                {"error": "Both date and operation parameters are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            if date < timezone.now().date():
                return Response(
                    {"error": "Cannot book appointments in the past"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get and validate operation
        try:
            operation = Operation.objects.get(id=operation_id, is_active=True)
        except Operation.DoesNotExist:
            return Response(
                {"error": "Invalid or inactive operation"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if dentist performs this operation
        dentist_operation = DentistOperation.objects.filter(
            dentist=dentist,
            operation=operation,
            is_active=True
        ).first()
        
        if not dentist_operation:
            return Response(
                {"error": "This dentist does not perform this operation"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get dentist's schedule for the day
        schedule = DentistSchedule.objects.filter(
            dentist=dentist,
            day_of_week=date.weekday(),
            is_active=True
        ).first()

        if not schedule:
            return Response({
                "available_slots": [],
                "message": "Dentist is not available on this day"
            })

        # Get existing appointments for the day
        appointments = Appointment.objects.filter(
            dentist=dentist,
            appointment_date=date,
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_time')

        # Generate available time slots
        available_slots = []
        current_time = schedule.start_time
        operation_duration = operation.duration

        while current_time <= schedule.end_time:
            # Calculate slot end time
            slot_end_time = (
                datetime.combine(date, current_time) + 
                timedelta(minutes=operation_duration)
            ).time()
            
            # Break if slot would end after schedule end time
            if slot_end_time > schedule.end_time:
                break

            slot_available = True
            slot_datetime = datetime.combine(date, current_time)

            # Check for conflicts with existing appointments
            for appt in appointments:
                appt_end_datetime = datetime.combine(
                    date, appt.appointment_time
                ) + timedelta(minutes=appt.duration)
                
                appt_datetime = datetime.combine(date, appt.appointment_time)

                # Check if slot overlaps with appointment
                if (slot_datetime < appt_end_datetime and 
                    slot_datetime + timedelta(minutes=operation_duration) > appt_datetime):
                    slot_available = False
                    break

            # If slot is available, add it to the list
            if slot_available:
                available_slots.append({
                    'time': current_time.strftime('%H:%M'),
                    'end_time': slot_end_time.strftime('%H:%M'),
                    'duration': operation_duration
                })

            # Move to next slot (30-minute intervals)
            current_time = (
                datetime.combine(date, current_time) + 
                timedelta(minutes=30)
            ).time()

        return Response({
            "dentist": {
                "id": dentist.id,
                "name": str(dentist),
                "specialization": dentist.specialization
            },
            "operation": {
                "id": operation.id,
                "name": operation.name,
                "duration": operation_duration,
                "price": str(dentist_operation.get_final_price())
            },
            "date": date_str,
            "available_slots": available_slots,
            "schedule": {
                "start_time": schedule.start_time.strftime('%H:%M'),
                "end_time": schedule.end_time.strftime('%H:%M')
            }
        })

class OperationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing dental operations.
    Provides 'list' and 'retrieve' actions.
    """
    queryset = Operation.objects.filter(is_active=True)
    serializer_class = OperationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True)
    def dentists(self, request, pk=None):
        """Get all dentists who perform this operation"""
        operation = self.get_object()
        dentist_operations = DentistOperation.objects.filter(
            operation=operation,
            is_active=True
        ).select_related('dentist')
        
        dentists = [op.dentist for op in dentist_operations]
        serializer = DentistSerializer(dentists, many=True)
        return Response(serializer.data)

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointments.
    Provides CRUD operations for appointments.
    Additional actions: cancel, upcoming, past, today
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return appointments for the current user only"""
        return Appointment.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        """Create new appointment"""
        try:
            serializer.save(
                patient=self.request.user,
                status='scheduled'
            )
        except ValidationError as e:
            raise ValidationError(detail=str(e))

    def perform_update(self, serializer):
        """Update appointment"""
        # Only allow updating notes field
        instance = self.get_object()
        if instance.status != 'scheduled':
            raise ValidationError(
                "Can only modify scheduled appointments"
            )
        
        serializer.save(patient=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        
        # Validate cancellation
        if appointment.status != 'scheduled':
            return Response(
                {"error": "Only scheduled appointments can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if appointment.appointment_date < timezone.now().date():
            return Response(
                {"error": "Cannot cancel past appointments"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cancel the appointment
        appointment.status = 'cancelled'
        appointment.save()
        
        return Response({
            "status": "success",
            "message": "Appointment cancelled successfully",
            "appointment_id": appointment.id
        })

    @action(detail=False)
    def upcoming(self, request):
        """Get user's upcoming appointments"""
        appointments = self.get_queryset().filter(
            appointment_date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_date', 'appointment_time')
        
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def past(self, request):
        """Get user's past appointments"""
        appointments = self.get_queryset().filter(
            appointment_date__lt=timezone.now().date()
        ).order_by('-appointment_date', '-appointment_time')
        
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def today(self, request):
        """Get user's appointments for today"""
        appointments = self.get_queryset().filter(
            appointment_date=timezone.now().date()
        ).order_by('appointment_time')
        
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def statistics(self, request):
        """Get appointment statistics for the user"""
        total_appointments = self.get_queryset().count()
        upcoming_appointments = self.get_queryset().filter(
            appointment_date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).count()
        completed_appointments = self.get_queryset().filter(
            status='completed'
        ).count()
        cancelled_appointments = self.get_queryset().filter(
            status='cancelled'
        ).count()

        return Response({
            "total_appointments": total_appointments,
            "upcoming_appointments": upcoming_appointments,
            "completed_appointments": completed_appointments,
            "cancelled_appointments": cancelled_appointments
        })

