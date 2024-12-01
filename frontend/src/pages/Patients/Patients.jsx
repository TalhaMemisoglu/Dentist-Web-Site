import React from 'react';
import './Patients.scss'; // SCSS dosyasını import edin
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS'yi import edin
import { useNavigate } from 'react-router-dom'; // Navigasyon için useNavigate import edin
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';

const Patients = () => {
  const navigate = useNavigate(); // navigate fonksiyonunu başlat

  const handleExistingPatientClick = () => {
    navigate('/login', { // Make login then redirect to choose
      state: { redirectTo: '/choose' } 
    });
  };

  const handleNewPatientClick = () => {
    navigate('/register', { // Make register then redirect to choose
      state: { 
        //isNewPatient: true,
        redirectAfterRegister: '/choose' 
      }
    }); // "Yeni Hasta" butonuna tıklandığında new patient sayfasına yönlendir
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
            <button 
              className="btn-new-patient"
              onClick={handleNewPatientClick} // On button click, navigate to new patient page
            >
              Yeni Hasta
            </button>
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
