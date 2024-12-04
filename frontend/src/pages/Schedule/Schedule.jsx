import React from 'react';
import BigCalendar from '../../components/Big-Calendar/Big-Calendar';

const events = [
    {
        PatientName: 'Christopher Nolan',
        treatment: 'Teeth Whitening',
        start: new Date(2024, 11, 4, 9, 0), // Start time
        end: new Date(2024, 11, 4, 10, 0),  // End time
    },
    {
        PatientName: 'Quentin Tarantino',
        treatment: 'Root Canal',
        start: new Date(2024, 11, 1, 14, 0),
        end: new Date(2024, 11, 1, 15, 0),
    },
    {
        PatientName: 'Guelermo Del Toro',
        treatment: 'Root Canal',
        start: new Date(2024, 11, 5, 14, 0),
        end: new Date(2024, 11, 5, 15, 0),
    },
];

const Schedule = () => {
    return (
        <div>
            <h1>Randevu Takvimi</h1>
            <BigCalendar 
                events={events}
            />
        </div>
    );
};

export default Schedule;
