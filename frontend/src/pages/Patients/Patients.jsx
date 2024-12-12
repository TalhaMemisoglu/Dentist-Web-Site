import React from 'react';
import './Patients.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';

const Patients = () => {
  const navigate = useNavigate();

  const handleExistingPatientClick = () => {
    navigate('/login', { state: { redirectTo: '/choose' } });
  };

  const handleNewPatientClick = () => {
    navigate('/register', { state: { redirectAfterRegister: '/choose' } });
  };

  return (
    <>
      <Navbar />
      <div className="appointment-container d-flex justify-content-center align-items-center">
        <div className="main-content" style={{ maxWidth: '600px', width: '100%' }}>
          <h1 className="page-title" style={{ fontSize: '28px', textAlign: 'center' }}>
            Ziyaretinizi Planlayalım
          </h1>
          <div className="question-box" style={{ width: '100%', padding: '40px' }}>
            <h2 style={{ fontSize: '20px', textAlign: 'center' }}>Daha önce klinikte bulundunuz mu?</h2>
            <div className="button-container" style={{ marginTop: '30px' }}>
              <button
                className="btn-new-patient"
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '300px',
                }}
                onClick={handleNewPatientClick}
              >
                Yeni Hasta
              </button>
              <span
                className="button-text"
                style={{
                  fontSize: '14px',
                  marginTop: '5px',
                  textAlign: 'center',
                }}
              >
                Yeniyim.
              </span>

              <button
                className="btn-existing-patient"
                style={{
                  padding: '12px 16px',
                  fontSize: '16px',
                  width: '100%',
                  maxWidth: '300px',
                }}
                onClick={handleExistingPatientClick}
              >
                Eski Hasta
              </button>
              <span
                className="button-text"
                style={{
                  fontSize: '14px',
                  marginTop: '5px',
                  textAlign: 'center',
                }}
              >
                Daha önce klinikte bulundum.
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Patients;