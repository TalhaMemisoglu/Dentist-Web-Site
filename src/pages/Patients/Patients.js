import React from 'react';
import './Patients.scss'; // Import the SCSS file for styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';

const Patients = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleExistingPatientClick = () => {
    navigate('/login'); // Redirect to the login page when the "Eski Hasta" button is clicked
  };

  return (
      <>
      <Navbar/>
     
      <div className="appointment-container">
      
      <div className="main-content">
      <h1 className="page-title">Ziyaretinizi Planlayalım</h1>
      <p></p>
        <div className="question-box">
          <h2>Daha önce klinikte bulundunuz mu?</h2>
          <div className="button-container">
            <button className="btn-new-patient">Yeni Hasta</button>
            <span className="button-text">Yeniyim.</span>

            <button 
              className="btn-existing-patient"
              onClick={handleExistingPatientClick} // On button click, navigate to login page
            >
              Eski Hasta
            </button>
            <span className="button-text">Daha önce klinikte bulundum.</span>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
      </>
  );
};

export default Patients;
