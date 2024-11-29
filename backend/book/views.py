from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer, DentistSerializer
from api.models import CustomUser

class DentistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(user_type='dentist', is_active=True)
    serializer_class = DentistSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True)
    def available_slots(self, request, pk=None):
        dentist = self.get_object()
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {"error": "Date parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get booked appointments for the day
        appointments = Appointment.objects.filter(
            dentist=dentist,
            appointment_date=date,
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_time')

        # Generate time slots (9 AM to 5 PM, 60-minute intervals)
        available_slots = []
        current_time = datetime.strptime('09:00', '%H:%M').time()
        end_time = datetime.strptime('17:00', '%H:%M').time()

        while current_time < end_time:
            if not self._is_slot_booked(current_time, appointments):
                available_slots.append(current_time.strftime('%H:%M'))
            current_time = (datetime.combine(date, current_time) + 
                          timedelta(minutes=60)).time()

        return Response({"available_slots": available_slots})

    def _is_slot_booked(self, time, appointments):
        for appt in appointments:
            appt_end = (datetime.combine(appt.appointment_date, appt.appointment_time) + 
                       timedelta(minutes=appt.duration)).time()
            if time >= appt.appointment_time and time < appt_end:
                return True
        return False

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist=user)
        return Appointment.objects.none()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        
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

        appointment.status = 'cancelled'
        appointment.save()
        
        return Response({"status": "Appointment cancelled successfully"})

    @action(detail=False)
    def upcoming(self, request):
        appointments = self.get_queryset().filter(
            appointment_date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        )
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)