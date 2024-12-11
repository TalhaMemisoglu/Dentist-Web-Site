import React from 'react';
import BigCalendar from '../../components/Big-Calendar/Big-Calendar';

const events = [
    {
        PatientName: 'Christopher Nolan',
        treatment: 'Teeth Whitening',
        start: new Date(2024, 11, 11, 9, 0), // Start time
        end: new Date(2024, 11, 11, 10, 0),  // End time
    },
    {
        PatientName: 'Quentin Tarantino',
        treatment: 'Root Canal',
        start: new Date(2024, 11, 10, 14, 0),
        end: new Date(2024, 11, 10, 15, 0),
    },
    {
        PatientName: 'Guelermo Del Toro',
        treatment: 'Root Canal',
        start: new Date(2024, 11, 9, 9, 0),
        end: new Date(2024, 11, 9, 10, 0),
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
