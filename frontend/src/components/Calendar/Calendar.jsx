import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import './Calendar.scss'; // Import custom styling

const CalendarView = ({ onDateChange }) => {
    const [date, setDate] = useState(new Date()); // Selected date
    const [availableDates, setAvailableDates] = useState([
        // Static data for available dates
        '2024-11-25',
        '2024-11-26',
        '2024-11-27',
        '2024-11-28',
        '2024-11-29',
    ]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulated API call logic (commented out)
        // Uncomment to fetch available dates dynamically
        /*
        const fetchAvailableDates = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/available-dates/`);
                setAvailableDates(response.data.available_dates); // Adjust based on your API response structure
            } catch (err) {
                console.error(err);
                setError('Failed to fetch available dates. Please try again later.');
            }
        };

        fetchAvailableDates();
        */
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleChange = (selectedDate) => {
        setDate(selectedDate);

        // Notify parent if provided
        if (onDateChange) {
            onDateChange(selectedDate);
        }

        // Simulated API post logic (commented out)
        // Uncomment to send selected date to the backend
        /*
        try {
            const response = await axios.post(
                `${apiEndpoint}/date-selected/`,
                { selected_date: selectedDate.toISOString().split('T')[0] },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Date selection result:', response.data);
        } catch (err) {
            console.error('Failed to save selected date:', err);
            setError('Failed to save selected date. Please try again.');
        }
        */
    };

    const formatShortWeekday = (locale, date) => {
        const daysOfWeek = ['Pz', 'Pzt', 'Salı', 'Çrş', 'Prş', 'Cuma', 'Cmt']; // Custom weekday names
        return daysOfWeek[date.getDay()];
    };

    return (
        <div className="calendar-container" style={styles.container}>
            {error && <p className="error-message">{error}</p>}
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

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#f5f5f5', // Light gray background
    },
};

export default CalendarView;
