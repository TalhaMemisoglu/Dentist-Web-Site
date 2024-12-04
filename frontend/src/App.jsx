import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contactus from './pages/Contact/Contactus';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Patients from './pages/Patients/Patients';
import Choose from './pages/Choose/Choose';
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from './pages/Appointment/Appointment';
import Profile from './pages/Profile/Profile'; // Profile bileşeni import edildi
import Sidebar from './components/Sidebar/Sidebar';
import Schedule from "./pages/Schedule/Schedule";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function logoutAndRegister() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="/singleservice" element={<Services />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile rotası eklendi */}
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
