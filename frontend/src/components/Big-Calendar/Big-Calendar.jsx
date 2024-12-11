import 'react-big-calendar/lib/css/react-big-calendar.css';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import './Big-Calendar.scss'
import { Button, HStack } from '@chakra-ui/react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const localizer = momentLocalizer(moment);

const BigCalendar = ({ events }) => {
    // Custom event renderer to display PatientName and treatment
    const EventComponent = ({ event }) => (
        <div>
            <strong>{event.PatientName}</strong>
            <div>{event.treatment}</div>
        </div>
    );

    // Define custom names for days
    const customDayNames = [
        'Pazar',      // Sunday (0)
        'Pazartesi',  // Monday (1)
        'Salı',       // Tuesday (2)
        'Çarşamba',   // Wednesday (3)
        'Perşembe',   // Thursday (4)
        'Cuma',       // Friday (5)
        'Cumartesi',  // Saturday (6)
    ];

    const customMonthNames = [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
    ];

    // Haftanın ilk günü Pazartesi olacak
    moment.updateLocale('tr', {
        week: {
            dow: 1, // Pazartesi (0 = Pazar, 1 = Pazartesi)
        },
    });

    // Custom formats for 24-hour time and custom day names
    // Custom formats
    const formats = {
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
        weekdayFormat: (date) => customDayNames[moment(date).day()], // Week in month_view
        dayFormat: (date) => {
            const dayName = customDayNames[moment(date).day()];
            const dayNumber = moment(date).date();
            return ` ${dayNumber} - ${dayName}`;
        },
        monthHeaderFormat: (date) => customMonthNames[moment(date).month()],
        dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
            const startDay   = moment(start).date();
            const endDay     = moment(start).add(4, 'days').date(); // add 4 days for 5 days week
            const startMonth = customMonthNames[moment(start).month()];
            const endMonth   = customMonthNames[moment(start).add(4, 'days').month()];
            return startMonth === endMonth
            ? `${startMonth} - ${startDay} - ${endDay}`
            : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        },
    };

    // const CustomToolbar = ({ label, onNavigate }) => {
    //     return (
    //         <HStack justifyContent="space-between" mb={4}>
    //             <Button onClick={() => onNavigate('PREV')} leftIcon={<FaArrowLeft />} variant="outline">
    //                 Back
    //             </Button>
    //             <div>{label}</div>
    //             <Button onClick={() => onNavigate('NEXT')} rightIcon={<FaArrowRight />} variant="outline">
    //                 Next
    //             </Button>
    //         </HStack>
    //     );
    // };

    // Set the visible time range (9:00 AM to 5:00 PM)
    const minTime = new Date();
    minTime.setHours(9, 0, 0); // 9:00 AM

    const maxTime = new Date();
    maxTime.setHours(17, 0, 0); // 5:00 PM

     // Ensure Monday is the first day of the week
     const weekStartsOn = 1;

    const allowedViews = ['week'];

    return (
        <div className='big-calendar-container'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView='week'  // week as the default view
                toolbar={true}     // disable the toolbar
                views={allowedViews}
                formats={formats}   // apply custom formats
                style={{ height: 800 }}
                min={minTime}
                max={maxTime}
                components={{
                    event: EventComponent,
                    // toolbar: CustomToolbar, // not working right now
                }}
                firstDay={weekStartsOn}
            />
        </div>
    );
};

export default BigCalendar;
