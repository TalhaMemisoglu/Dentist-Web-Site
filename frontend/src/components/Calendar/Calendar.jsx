import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import './Calendar.scss'; // Import custom styling

const CalendarView = ({ onDateChange, selectedDate, availableDates }) => {
    const [date, setDate] = useState(selectedDate || new Date()); // Selected date with fallback to current date

    // Extract only date strings from availableDates
    const availableDateStrings = availableDates.map((d) => d.date);
    // console.log("uygun gunler stringi: ", availableDateStrings);

    useEffect(() => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    }, [selectedDate]);

    const handleChange = (selectedDate) => {
        setDate(selectedDate);
    
        // Notify parent component
        if (onDateChange) {
            // Use local timezone to format the date
            const formattedDate = selectedDate.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
            onDateChange(formattedDate);
        }
    };


    const formatShortWeekday = (locale, date) => {
        const daysOfWeek = ['Pz', 'Pzt', 'Salı', 'Çrş', 'Prş', 'Cuma', 'Cmt']; // Custom weekday names
        return daysOfWeek[date.getDay()];
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleChange}
                value={date}
                tileDisabled={({ date }) => {
                    const formattedDate = date.toLocaleDateString('en-CA'); // "YYYY-MM-DD" formatına uygun
                    return !availableDateStrings.includes(formattedDate);
                }}
                showNeighboringMonth={false}
                showFixedNumberOfWeeks={false}
                next2Label={null}
                prev2Label={null}
                minDate={new Date()}
                formatShortWeekday={formatShortWeekday}
                minDetail="month"
            />
        </div>
    );
};

export default CalendarView;