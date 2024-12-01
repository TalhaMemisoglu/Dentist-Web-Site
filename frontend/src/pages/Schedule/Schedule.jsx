import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';
import CalendarView from '../../components/Calendar/Calendar';
import api from "../../api";

const Schedule = () => {

    const location = useLocation();
    const chosenService = location.state?.service;
    const chosenDentist = location.state?.dentist;
    
    // Get dentistId from chosenDentist
    const dentistId = chosenDentist?.id;

    const [selectedDate, setSelectedDate] = useState(null);
    const [availableHours, setAvailableHours] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
      const fetchAvailableDates = async (dentistId) => {
          try {
              const res = await api.get(`/api/booking/dentists/${dentistId}/available_dates/`);
              setAvailableDates(res.data.available_dates); // Adjust based on the API response
              console.log(res.data);
          } catch (err) {
              alert("Error fetching available dates: " + err.message);
          }
      };

      if (dentistId) {
          fetchAvailableDates(dentistId);
      }
  }, [dentistId]); // Include dentistId as a dependency if it's dynamic

    // Fetch available hours when date is selected
    useEffect(() => {
        const fetchAvailableHours = async () => {
            if (!dentistId || !selectedDate) return;

            try {
                const response = await api.get(
                    `/api/booking/dentists/${dentistId}/available_slots/`,
                    { params: { date: selectedDate } }
                );
                setAvailableHours(response.data.available_slots);
            } catch (err) {
                console.error('Error fetching hours:', err);
                setError(err.response?.data?.detail || 'Failed to fetch hours');
            }
        };

        if (selectedDate) {
            fetchAvailableHours();
        }
    }, [dentistId, selectedDate]);

  // Handle the date selection from the calendar
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  // Submit appointment
  const handleSubmit = async () => {
    if (!dentistId || !selectedDate || !selectedTime) {
        setError('Please select all required fields');
        return;
    }

    try {
        const response = await api.post('/api/booking/appointments/', {
            dentist: dentistId,
            appointment_date: selectedDate,
            appointment_time: selectedTime.start_time,
            duration: 60 // or chosenService.duration
        });

        if (response.status === 201) {
            alert('Appointment created successfully!');
            // Redirect or further action
        }
    } catch (err) {
        console.error('Booking error:', err);
        setError(err.response?.data?.detail || 'Failed to create appointment');
    }
};

if (error) {
  return <div className="error-message">{error}</div>;
}

return (
  <>
    <Navbar />
    <div className='schedule-body'>
      <div className="booking-container">
        <h2 className="appointment-title">Randevunuzu Ayarlayalım</h2>
        <div className="main-content">
          {/* Display chosen service */}
          <div className='row content-body'>
            <div className='col col-lg-6 service-content'>
              {chosenService ? (
                <div className="service-box row">
                  {/* Show Chosen Service Info */}
                  <div className='col s-content'>
                    <h2>{chosenService.name}</h2>
                    <p>Süre: {chosenService.duration}</p>
                  </div>

                  {/* Change Button */}
                  <div className='col-auto change-button'>
                    <button className='btn-change'>Change</button>
                  </div>
                </div>
              ) : (
                <p>Seçilen hizmet bulunamadı.</p>
              )}
            </div>

            <div className='col-lg-6 dentist-content'>
              {chosenDentist ? (
                <div className="service-box row">
                  {/* Show Chosen Dentist Info */}
                  <div className='col d-content'>
                    <h2>{chosenDentist.name} {chosenDentist.surname}</h2>
                    <p>{chosenDentist.specialty}</p>
                  </div>

                  {/* Change Button */}
                  <div className='col-auto change-button'>
                    <button className='btn-change'>Change</button>
                  </div>
                </div>
              ) : (
                <p>Seçilen doktor bulunamadı.</p>
              )}
            </div>
          </div>

          <div className="calendar-hours-container">
            {/* Calendar Section */}
            <div className="calendar-section">
              <h3>Tarih Seçin</h3>
              <CalendarView 
                onDateChange={handleDateSelection}
                selectedDate={selectedDate}
                availableDates={availableDates}
              />
            </div>

            {/* Available Hours Section*/}
            <div className="available-hours-section">
              <h3>Uygun Saatler</h3>
              {availableHours.length > 0 ? (
                <div>
                  <ul>
                    {availableHours.map((hour, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleTimeSelection(hour)}
                          className={selectedTime === hour ? 'selected-time' : ''} // Optional: Highlight selected time
                        >
                          {hour}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Seçilen tarihte uygun saat bulunamadı.</p>
              )}


              {/* Create Appointment Button */}
              <div className='create-appointment'>
                <button
                  className="btn-continue"
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedTime} // Disable button if no date or time selected
                >
                  Randevu Oluştur
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);
};
export default Schedule;
