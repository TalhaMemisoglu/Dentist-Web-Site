import React, { useState, useEffect } from "react";
import api from "../../api";
import "./PatientAppointments.scss";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get("/api/booking/appointments");
        console.log("Fetched appointments:", response.data);

        setAppointments(
          Array.isArray(response.data.appointments)
            ? response.data.appointments
            : []
        );
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h4 className="appointments-title">Your Appointments</h4>
      <div className="appointments-content">
        {isLoading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="no-appointments">No appointments found.</p>
        ) : (
          appointments.map((appointment, index) => (
            <div key={index} className="appointment-card">
              <div className="appointment-header">
                <p className="appointment-date">
                  {new Date(appointment.appointment_date).toLocaleDateString("tr", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    hour12: false,
                  })}
                  ,{" "}
                  {new Date(`1970-01-01T${appointment.appointment_time}`).toLocaleTimeString(
                    "tr",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                  <span className="status scheduled">• {appointment.status}</span>
                  <br></br>
                  <br></br>
                  Tedavi: <strong>Kanal Tedavi</strong>
                  <br></br>
                  Süre:   <strong>{appointment.duration}</strong>
                </p>
              </div>
              <div className="appointment-body">
                <p className="appointment-treatment">
                  Doktor: <strong>{appointment.dentist_name}</strong>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;