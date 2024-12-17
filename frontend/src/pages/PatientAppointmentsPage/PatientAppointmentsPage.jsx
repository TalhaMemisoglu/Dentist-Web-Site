import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import PatientAppointments from "../../components/PatientAppointments/PatientAppointments";
import "./PatientAppointmentsPage.scss";

const PatientAppointmentsPage = () => {
  return (
    <div className="patient-appointments-page-container">
      {/* Sidebar Section */}
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>

      {/* Patient Appointments Section */}
      <div className="appointments-wrapper">
        <PatientAppointments />
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;