import 'react-big-calendar/lib/css/react-big-calendar.css';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './Big-Calendar.scss'

import 'moment/locale/tr';

moment.locale('tr');

// Moment'i lokalize edin
const localizer = momentLocalizer(moment);

const BigCalendar = ({ events }) => {
    // Custom event renderer to display PatientName and treatment
    const EventComponent = ({ event }) => (
        <div>
            <strong>{event.PatientName}</strong>
            <div>{event.treatment}</div>
        </div>
    );

    // Custom formats for 24-hour time and custom day names
    const formats = {
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture), // 24-hour time format
        dayFormat: (date, culture, localizer) =>
            customDayNames[moment(date).day()], // Custom day names
        eventTimeRangeFormat: () => '', // Remove time range in event boxes (optional)
    };

    // Define custom names for days
    const customDayNames = [
        'Pazar', // Sunday
        'Pazartesi', // Monday
        'Salı', // Tuesday
        'Çarşamba', // Wednesday
        'Perşembe', // Thursday
        'Cuma', // Friday
        'Cumartesi', // Saturday
    ];

    // Set the visible time range (9:00 AM to 5:00 PM)
    const minTime = new Date();
    minTime.setHours(9, 0, 0); // 9:00 AM

    const maxTime = new Date();
    maxTime.setHours(17, 0, 0); // 5:00 PM

     // Ensure Monday is the first day of the week
     const weekStartsOn = 1; // 1 = Monday (ISO 8601 standard)

    return (
        <div className='big-calendar-container'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView='week'  // week as the default view
                toolbar={false}     // disable the toolbar
                formats={formats}   // apply custom formats
                style={{ height: 800 }}
                min={minTime}
                max={maxTime}
                components={{
                    event: EventComponent,
                }}
                culture='tr' // Turkish Locale
                firstDay={weekStartsOn}
            />
        </div>
    );
};

export default BigCalendar;
