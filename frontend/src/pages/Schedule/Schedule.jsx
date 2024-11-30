import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';
import CalendarView from '../../components/Calendar/Calendar';
import axios from 'axios';

const apiEndpoint = 'http://localhost:8000';

const Schedule = ({ dentistId }) => {

  const location = useLocation();
  const chosenService = location.state?.service; // Safely access the service
  const chosenDentist = location.state?.dentist; // Safely access the dentist

  const [selectedDate, setSelectedDate] = useState(null); // State for selectedDate
  const [availableHours, setAvailableHours] = useState([]); // State for availableHours
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null); // State for selectedTime
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableHours = async () => {
        // try {
        //   const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        //   const response = await axios.get(
        //     `${apiEndpoint}/booking/dentists/${dentistId}/available_slots/`,
        //     { params: { date: formattedDate } } // Pass date as a query parameter
        //   );
        //   setAvailableHours(response.data.available_hours || []); // Update available hours
        //   setError(null); // Clear any previous error
        // } catch (err) {
        //   console.error(err);
        //   setError('Failed to fetch available hours. Please try again later.');
        //   setAvailableHours([]); // Reset available hours on error
        // }
        try {
          const response = await axios.get(`${apiEndpoint}/api/booking/dentists/${dentistId}/available_dates/`);
          console.log(response.data); // Log the response to see the structure and data
          const dates = response.data.available_dates;
          setAvailableDates(dates);
        } catch (err) {
          console.error(err); // Log the error if any
        }
      };

      fetchAvailableHours();
    }
  }, [selectedDate]);

  // Fetch available dates and set the first available date as the selected date
  useEffect(() => {
    const fetchAvailableDates = async () => {
      // try {
      //   const response = await axios.get(
      //     `${apiEndpoint}/api/booking/dentists/${dentistId}/available_dates/`
      //   );
      //   const dates = response.data.available_dates;
      //   setAvailableDates(dates);

      //   // Set the first available date if it's available
      //   if (dates.length > 0) {
      //     setSelectedDate(new Date(dates[0])); // Setting the first available date
      //   }
      // } catch (err) {
      //   console.error(err);
      //   setError('Failed to fetch available dates. Please try again later.');
      // }
      try {
        const response = await axios.get(`${apiEndpoint}/api/booking/dentists/${dentistId}/available_dates/`);
        console.log(response.data); // Log the response to see the structure and data
        const dates = response.data.available_dates;
        setAvailableDates(dates);
      } catch (err) {
        console.error(err); // Log the error if any
      }
    };

    fetchAvailableDates();
  }, [selectedDate]);

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
    const appointmentData = {
      date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      time: selectedTime,

      dentistId: dentistId, // neden bu sekilde erisilebiliyor

      serviceId: chosenService?.id,
    };

    try {
      const response = await axios.post(`${apiEndpoint}/appointments`, appointmentData);

      if (response.status === 200) {
        alert('Randevu başarıyla oluşturuldu!');
        // Redirect or further action
      } else {
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error(err);
      alert('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
};

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
