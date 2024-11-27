import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.scss';    
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';
import CalendarView from '../../components/Calendar/Calendar';

const Schedule = () => {
  
  const location = useLocation();
  const chosenService = location.state?.service; // Safely access the service
  const chosenDentist = location.state?.dentist; 

  // Placeholder state for selected date (currently unused)
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle the date selection from the calendar
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Navbar />
      <div className="booking-container">
        <h2 className="appointment-title">Randevunuzu Ayarlayalım</h2>
        <div className="main-content">
          {/* Display the selected service */}
          {chosenService ? (
            <div className="service-box">
              <h2>Seçtiğiniz Hizmet: {chosenService.name}</h2>
              <p>Süre: {chosenService.duration}</p>
            </div>
          ) : (
            <p>Seçilen hizmet bulunamadı.</p>
          )}
          {chosenDentist ? (
            <div className="service-box">
              <h2>Seçtiğiniz Doktor: {chosenDentist.username}</h2>
            </div>
          ) : (
            <p>Seçilen doktor bulunamadı.</p>
          )}

          <div className="calendar-hours-container">
            {/* Display a placeholder calendar */}
            <div className="calendar-section">
              <h3>Tarih Seçin</h3>
              <CalendarView onDateChange={handleDateSelection} />
            </div>

            {/* Message for no available hours */}
            <div className="available-hours-section">
              <h3>Uygun Saatler</h3>
              <p>Mevcut saat bulunamadı.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Schedule;
