import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import './Calendar.scss'; // Import custom styling

const CalendarView = ({ onDateChange, selectedDate, availableDates }) => {
    const [date, setDate] = useState(selectedDate || new Date()); // Selected date with fallback to current date

    useEffect(() => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    }, [selectedDate]); // Update local state if selectedDate prop changes
    const handleChange = (selectedDate) => {
        setDate(selectedDate);

        // Notify parent component
        if (onDateChange) {
            onDateChange(selectedDate);
        }
    };

    const formatShortWeekday = (locale, date) => {
        const daysOfWeek = ['Pz', 'Pzt', 'Salı', 'Çrş', 'Prş', 'Cuma', 'Cmt']; // Custom weekday names
        return daysOfWeek[date.getDay()];
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleChange} // Trigger on change
                value={date}
                tileDisabled={({ date }) =>
                    !availableDates.includes(date.toISOString().split('T')[0]) // Disable unavailable dates
                }
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
