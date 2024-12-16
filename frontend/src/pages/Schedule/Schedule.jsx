import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BigCalendar from '../../components/Big-Calendar/Big-Calendar';
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api";

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    console.warn("No token found. Redirecting to login...");
                    navigate("/login"); // Eğer token yoksa giriş sayfasına yönlendir
                    return;
                }

                const response = await api.get("/api/user/");
                console.log()
                const { user_type } = response.data;
                setUserType(user_type);

                // Eğer kullanıcı tipi admin, doctor, veya assistant değilse yönlendir
                if (!["admin", "doctor", "assistant"].includes(user_type)) {
                    console.warn("Unauthorized access. Redirecting...");
                    navigate("/unauthorized");
                    return;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user info.");
            }
        };

        fetchUserInfo();
    }, [navigate]);

    useEffect(() => {
        if (!userType) return; // Kullanıcı tipi yüklenmeden veri çekme

        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                let apiUrl;

                // Kullanıcı tipine göre API endpoint seçimi
                switch (userType) {
                    case "admin":
                        apiUrl = "/api/admin-calendar/all_appointments/";
                        break;
                    case "doctor":
                        apiUrl = "/api/doctor-calendar/appointments/";
                        break;
                    case "assistant":
                        apiUrl = "/api/assistant-calendar/schedule/";
                        break;
                    default:
                        console.error("Invalid user type");
                        return;
                }

                const response = await api.get(apiUrl);

                // API'den dönen veriyi Big Calendar formatına çevir
                const fetchedEvents = response.data.map((event) => ({
                    PatientName: event.patient_name,
                    treatment: event.treatment_name,
                    start: new Date(`${event.appointment_date}T${event.appointment_time}`),
                    end: new Date(`${event.appointment_date}T${event.appointment_time}`),
                }));

                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [userType]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
          <h1>Takvim</h1>
          <BigCalendar events={events} />
        </div>
      );
};
export default Schedule;

