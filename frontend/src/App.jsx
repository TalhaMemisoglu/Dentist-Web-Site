import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contactus from './pages/Contact/Contactus';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Patients from './pages/Patients/Patients';
import Choose from './pages/Choose/Choose';
import NotFound from "./pages/NotFound";
import Sidebar from './components/Sidebar/Sidebar'; // Sidebar bileşeni

// Clears storage and redirects to the login page
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

// Clears storage and redirects to the Register component
function logoutAndRegister() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('/api/user/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserType(response.data.user_type);
      } catch (error) {
        console.error("Error fetching user type:", error);
        setUserType('guest'); // Hata durumunda kullanıcı tipi 'guest' olarak atanır
      }
    };

    fetchUserType();
  }, []);

  if (userType === null) {
    return <p>Loading...</p>; // Kullanıcı tipi yüklenene kadar bir yükleme göstergesi
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/singleservice" element={<Services />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/choose" element={<Choose />} />

        {/* User-Specific Dashboard */}
        <Route path="/sidebar" element={<Sidebar />} />

        {/* User-Specific Redirect */}
        {userType === 'admin' && (
          <Route path="/dashboard" element={<Navigate to="/admin-dashboard" />} />
        )}
        {userType === 'doctor' && (
          <Route path="/dashboard" element={<Navigate to="/doctor-dashboard" />} />
        )}
        {userType === 'assistant' && (
          <Route path="/dashboard" element={<Navigate to="/assistant-dashboard" />} />
        )}
        {userType === 'patient' && (
          <Route path="/dashboard" element={<Navigate to="/patient-dashboard" />} />
        )}

        {/* Fallback */}
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
