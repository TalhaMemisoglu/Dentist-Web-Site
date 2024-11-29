import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import axios from 'axios';
import profilePhoto from '../../assets/about/team/1.png';

const Sidebar = () => {
  
  const [userType, setUserType] = useState(!null);
  console.log('User Type:', userType);
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('/api/user/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Token bilgisi
        });
        setUserType(response.data.user_type); // API'den gelen userType bilgisi
       
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };


    fetchUserType();
  }, []);

  if (!userType) {
    return <p>Loading...</p>; // Yükleniyor göstergesi
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="home-button">
          <span className="home-icon">🏠</span> Anasayfa
        </button>
      </div>
      <div className="profile-section">
        <div className="profile-image">
          <img 
            src={profilePhoto} // Profil fotoğrafı
            alt="Profil" 
          />
        </div>
        <p className="user-name">Helin Saygılı</p>
        <p className="user-role">
          {userType === 'admin' 
            ? 'Admin' 
            : userType === 'dentist' 
            ? 'Doktor' 
            : userType === 'assistant' 
            ? 'Asistan' 
            : 'Hasta'}
        </p>
      </div>
      <div className="sidebar-links">
        <ul>
          <li>
            <a href={`/${userType}-dashboard`}>
              <span className="icon">📊</span> Dashboard
            </a>
          </li>

          {userType === 'admin' && (
            <>
              <li>
                <a href="/add-staff">
                  <span className="icon">➕</span> Personel Ekle
                </a>
              </li>
              <li>
                <a href="/remove-staff">
                  <span className="icon">➖</span> Personel Çıkar
                </a>
              </li>
            </>
          )}

          {userType === 'dentist' && (
            <>
              <li>
                <a href="/appointments">
                  <span className="icon">📅</span> Randevular
                </a>
              </li>
              <li>
                <a href="/add-appointment">
                  <span className="icon">➕</span> Randevu Ekle
                </a>
              </li>
            </>
          )}

          {userType === 'assistant' && (
            <>
              <li>
                <a href="/appointments">
                  <span className="icon">📅</span> Randevular
                </a>
              </li>
              <li>
                <a href="/add-appointment">
                  <span className="icon">➕</span> Randevu Ekle
                </a>
              </li>
            </>
          )}

          {userType === 'patient' && (
            <>
              <li>
                <a href="/patient-appointments">
                  <span className="icon">📅</span> Randevularım
                </a>
              </li>
              <li>
                <a href="/book-appointment">
                  <span className="icon">📅</span> Randevu Al
                </a>
              </li>
            </>
          )}

          <li>
            <a href="/profile">
              <span className="icon">⚙️</span> Profil
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.scss';


const Sidebar= () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('/api/user/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Replace with your token logic
        });
        setUserType(response.data.user_type);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []);

  if (!userType) {
    return <p>Loading...</p>; // Show a loading indicator while fetching user type
  }

  switch (userType) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'patient':
      return <PatientDashboard />;
    case 'assistant':
      return <AssistantDashboard />;
    default:
      return <p>Unknown user type</p>;
  }
};

const AdminDashboard = () => <h1>Welcome to Admin Dashboard</h1>;
const DoctorDashboard = () => <h1>Welcome to Doctor Dashboard</h1>;
const PatientDashboard = () => <h1>Welcome to Patient Dashboard</h1>;
const AssistantDashboard = () => <h1>Welcome to Assistant Dashboard</h1>;

export default Sidebar; */