from rest_framework import viewsets, permissions, status
from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import datetime, timedelta, time
from .models import Appointment
from .serializers import AppointmentSerializer, DentistSerializer
from api.models import CustomUser
from django.db.models import Q

from pytz import timezone as pytz_timezone
local_timezone = pytz_timezone("Europe/Istanbul")  # Replace with desired time zone
local_now = timezone.localtime(timezone.now(), local_timezone)

class DentistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(user_type='dentist', is_active=True)
    serializer_class = DentistSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_work_hours(self, date):
        # 9 to 5 
        day_of_week = date.weekday()
        work_hours = {
            0: ('09:00', '17:00'),  # Monday
            1: ('09:00', '17:00'),  # Tuesday
            2: ('09:00', '17:00'),  # Wednesday
            3: ('09:00', '17:00'),  # Thursday
            4: ('09:00', '17:00'),  # Friday
            5: None,  # Saturday 
            6: None,  # Sunday 
        }
        return work_hours.get(day_of_week)

    @action(detail=True)
    def available_dates(self, request, pk=None):
        """Get available dates for next 30 days"""
        dentist = self.get_object()
        start_date = local_now.date()
        end_date = start_date + timedelta(days=30)
        
        # Get all booked appointments
        booked_appointments = Appointment.objects.filter(
            dentist=dentist,
            appointment_date__range=[start_date, end_date],
            status__in=['scheduled', 'confirmed']
        ).values('appointment_date').annotate(
            appointment_count=Count('id')
        )
        
        # Create list of dates
        available_dates = []
        current_date = start_date
        
        while current_date <= end_date:
            # Skip past and non-work dates
            if current_date.weekday() < 5 and current_date >= local_now.date():
                # 9 to 5 8 slot 1-hour each
                booked_count = next(
                    (item['appointment_count'] for item in booked_appointments 
                     if item['appointment_date'] == current_date), 
                    0
                )
                
                if booked_count < 7:
                    available_dates.append({
                        'date': current_date.strftime('%Y-%m-%d'),
                        'day_name': current_date.strftime('%A'),
                        'available_slots': 7 - booked_count
                    })
            
            current_date += timedelta(days=1)
        
        return Response({
            'dentist': {
                'id': dentist.id,
                'name': dentist.get_full_name()
            },
            'available_dates': available_dates
        })
    
    @action(detail=True)
    def available_slots(self, request, pk=None):
        """Get available time slots for a specific date"""
        dentist = self.get_object()
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {"error": "Date parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            if date < local_now.date():
                return Response(
                    {"error": "Cannot book appointments in the past"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get work hours
        work_hours = self.get_work_hours(date)
        if not work_hours:
            return Response({
                "error": "Selected date is not a working day",
                "available_slots": []
            })

        start_time_str, end_time_str = work_hours
        start_time = datetime.strptime(start_time_str, '%H:%M').time()
        end_time = datetime.strptime(end_time_str, '%H:%M').time()

        # Get booked appointments
        booked_slots = Appointment.objects.filter(
            dentist=dentist,
            appointment_date=date,
            status__in=['scheduled', 'confirmed']
        ).values_list('appointment_time', flat=True)

        # Generate available slots
        available_slots = []
        current_time = start_time
        
        while current_time < end_time:
            # If current date, skip past times
            if date == local_now.date() and current_time < local_now.time():
                current_time = (datetime.combine(date, current_time) + 
                              timedelta(hours=1)).time()
                continue

            if current_time not in booked_slots:
                slot_end = (datetime.combine(date, current_time) + 
                           timedelta(hours=1)).time()
                available_slots.append({
                    'start_time': current_time.strftime('%H:%M'),
                    'end_time': slot_end.strftime('%H:%M')
                })

            current_time = (datetime.combine(date, current_time) + 
                          timedelta(hours=1)).time()

        return Response({
            "dentist": {
                "id": dentist.id,
                "name": dentist.get_full_name()
            },
            "date": date_str,
            "work_hours": {
                "start": start_time_str,
                "end": end_time_str
            },
            "available_slots": available_slots
        })
    


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

    def perform_create(self, serializer):
        print(f"\n=== Perform Create ===")
        print(f"Serializer data before save: {serializer.validated_data}")
        serializer.save()

    def create(self, request, *args, **kwargs):
        print("\n=== ViewSet create method detailed logs ===")
        print(f"Request user: {request.user}")
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User type: {request.user.user_type}")
        print(f"Raw request data: {request.data}")
        print(f"User_id: {request.user.id}")

        mutable_data = request.data.copy()
        mutable_data['patient'] = request.user.id
        
        try:
            serializer = self.get_serializer(data=mutable_data)
            serializer.is_valid(raise_exception=True)
            
            self.perform_create(serializer)
            
            updated_appointments = self.get_queryset().order_by('-appointment_date', '-appointment_time')
            appointments_serializer = self.get_serializer(updated_appointments, many=True)
            
            return Response({
                'message': 'Appointment created successfully',
                'user_id': request.user.id,
                'user_type': request.user.user_type,
                'appointments': appointments_serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except serializer.ValidationError as e:
            print(f"Validation error: {str(e)}")
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'user_id': request.user.id,
            'user_type': request.user.user_type,
            'appointments': serializer.data
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        
        if appointment.status != 'scheduled':
            return Response(
                {"error": "Only scheduled appointments can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if appointment.appointment_date < local_now.date():
            return Response(
                {"error": "Cannot cancel past appointments"},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = 'cancelled'
        appointment.save()
        
        appointments = self.get_queryset().order_by('-appointment_date', '-appointment_time')
        serializer = self.get_serializer(appointments, many=True)
        
        return Response({
            'message': 'Appointment cancelled successfully',
            'user_id': request.user.id,
            'user_type': request.user.user_type,
            'appointments': serializer.data
        })

    @action(detail=False)
    def upcoming(self, request):
        appointments = self.get_queryset().filter(
            appointment_date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_date', 'appointment_time')
        
        serializer = self.get_serializer(appointments, many=True)
        return Response({
            'user_id': request.user.id,
            'user_type': request.user.user_type,
            'appointments': serializer.data
        })

    @action(detail=False)
    def my_appointments(self, request):
        appointments = self.get_queryset().order_by('-appointment_date', '-appointment_time')
        serializer = self.get_serializer(appointments, many=True)
        
        return Response({
            'user_id': request.user.id,
            'user_type': request.user.user_type,
            'appointments': serializer.data
        })

        """
        API endpoints for assistant calendar
        GET /api/booking/appointments/calendar_appointments/
        GET /api/booking/appointments/appointments_by_date/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
        GET /api/booking/appointments/appointments_stats/

        """


    @action(detail=False) # Assistant only calendar view
    def calendar_appointments(self, request):
        if request.user.user_type != 'assistant':
            return Response(
                {"error": "Only assistants can access all appointments"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all appointments
        appointments = Appointment.objects.all().select_related('patient', 'dentist')
        
        # Format appointments for calendar view
        calendar_data = []
        for appointment in appointments:
            calendar_data.append({
                'id': appointment.id,
                'title': f"Dt. {appointment.dentist.username} - {appointment.patient.username}",
                'start': datetime.combine(
                    appointment.appointment_date, 
                    appointment.appointment_time
                ).isoformat(),
                'end': datetime.combine(
                    appointment.appointment_date,
                    (datetime.combine(appointment.appointment_date, appointment.appointment_time) + 
                     timedelta(minutes=appointment.duration)).time()
                ).isoformat(),
                'status': appointment.status,
                'patient_id': appointment.patient.id,
                'patient_name': appointment.patient.get_full_name(),
                'dentist_id': appointment.dentist.id,
                'dentist_name': appointment.dentist.get_full_name()
            })

        return Response(calendar_data)

    @action(detail=False) # Assistant only date range calendar view
    def appointments_by_date(self, request):
        if request.user.user_type != 'assistant':
            return Response(
                {"error": "Only assistants can access all appointments"},
                status=status.HTTP_403_FORBIDDEN
            )

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointments = Appointment.objects.filter(
            appointment_date__range=[start_date, end_date]
        ).select_related('patient', 'dentist')

        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=False) # Assistant only appointment statistics
    def appointments_stats(self, request):
        if request.user.user_type != 'assistant':
            return Response(
                {"error": "Only assistants can access appointment statistics"},
                status=status.HTTP_403_FORBIDDEN
            )

        today = timezone.now().date()
        
        # Get counts for different statuses
        total_appointments = Appointment.objects.count()
        upcoming_appointments = Appointment.objects.filter(
            appointment_date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).count()
        completed_appointments = Appointment.objects.filter(status='completed').count()
        cancelled_appointments = Appointment.objects.filter(status='cancelled').count()

        # Get appointments by dentist
        appointments_by_dentist = (
            Appointment.objects.values('dentist__username')
            .annotate(count=models.Count('id'))
            .order_by('-count')
        )

        return Response({
            'total_appointments': total_appointments,
            'upcoming_appointments': upcoming_appointments,
            'completed_appointments': completed_appointments,
            'cancelled_appointments': cancelled_appointments,
            'appointments_by_dentist': appointments_by_dentist
        })



        """
        API endpoints for dentist calendar
        GET /api/booking/appointments/dentist_calendar/
        GET /api/booking/appointments/dentist_appointments_by_date/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
        GET /api/booking/appointments/dentist_daily_schedule/?date=YYYY-MM-DD

        """


        @action(detail=False) # Dentist calendar view
        def dentist_calendar(self, request):
           
            if request.user.user_type != 'dentist':
                return Response(
                    {"error": "Only dentists can access their calendar"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Get all appointments for the specific dentist
            appointments = Appointment.objects.filter(
                dentist=request.user
            ).select_related('patient')
            
            calendar_data = []
            for appointment in appointments:
                # Calculate end time based on duration
                start_datetime = datetime.combine(
                    appointment.appointment_date, 
                    appointment.appointment_time
                )
                end_datetime = start_datetime + timedelta(minutes=appointment.duration)

                calendar_data.append({
                    'id': appointment.id,
                    'title': f"Patient: {appointment.patient.get_full_name()}",
                    'start': start_datetime.isoformat(),
                    'end': end_datetime.isoformat(),
                    'status': appointment.status,
                    'patient_id': appointment.patient.id,
                    'patient_name': appointment.patient.get_full_name(), 
                    'notes': appointment.notes,
                    # Colour coding based on status
                    'colour': {
                        'scheduled': '#ffd700',  # gold
                        'confirmed': '#32cd32',  # green
                        'completed': '#4169e1',  # blue
                        'cancelled': '#dc143c',  # red
                        'no_show': '#808080'     # gray
                    }.get(appointment.status, '#000000')
                })

            return Response(calendar_data)

        @action(detail=False) # Dentist calendar view with date range
        def dentist_appointments_by_date(self, request):
            if request.user.user_type != 'dentist':
                return Response(
                    {"error": "Only dentists can access their appointments"},
                    status=status.HTTP_403_FORBIDDEN
                )

            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            appointments = Appointment.objects.filter(
                dentist=request.user,
                appointment_date__range=[start_date, end_date]
            ).select_related('patient')

            serializer = self.get_serializer(appointments, many=True)
            return Response(serializer.data)

        @action(detail=False)
        def dentist_daily_schedule(self, request):
            if request.user.user_type != 'dentist':
                return Response(
                    {"error": "Only dentists can access their schedule"},
                    status=status.HTTP_403_FORBIDDEN
                )

            date_str = request.query_params.get('date')
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            appointments = Appointment.objects.filter(
                dentist=request.user,
                appointment_date=target_date
            ).select_related('patient').order_by('appointment_time')

            schedule_data = []
            for appointment in appointments:
                schedule_data.append({
                    'id': appointment.id,
                    'time': appointment.appointment_time.strftime('%H:%M'),
                    'duration': appointment.duration,
                    'patient_name': appointment.patient.get_full_name(),
                    'status': appointment.status,
                    'notes': appointment.notes
                })

            return Response({
                'date': target_date.strftime('%Y-%m-%d'),
                'appointments': schedule_data,
                'total_appointments': len(schedule_data)
            })