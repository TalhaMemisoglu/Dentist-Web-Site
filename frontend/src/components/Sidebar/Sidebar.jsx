import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.scss";
import profilePhoto from "../../assets/about/team/1.png";
import { ACCESS_TOKEN } from "../../constants";

const USER_TYPE_LABELS = {
  dentist: "Dentist",
  patient: "Patient",
  assistant: "Assistant",
  manager: "Manager",
};

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Token retrieved from localStorage:", token);  // Debug: token fetched from localStorage

        if (!token) {
          console.warn("No token found. Redirecting to login...");
          navigate("/login"); // Redirect to login if no token is found
          return;
        }

        console.log("Token from localStorage:", token);
        
        const response = await axios.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Response from backend:", response); // Debug: Response from the backend
        console.log("Authorization Header Sent:", `Bearer ${token}`); // Debug: Check the header sent

        if (response.status === 200) {
          console.log("User data:", response.data); // Debug: User data fetched from the API
          setUser(response.data);
        } else {
          console.error("Failed to fetch user data:", response.status); // Debug: if not 200 OK
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response || error.message); // Debug: Detailed error message
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (!user) {
    console.log("User data not available, showing loading..."); // Debug: Log when user data is not loaded yet
    return <p>Loading...</p>;
  }

  const { user_type: userType, first_name: firstName, last_name: lastName } = user;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          <span className="home-icon">🏠</span> Anasayfa
        </button>
      </div>
      <div className="profile-section">
        <div className="profile-image">
          <img src={profilePhoto} alt="Profile" />
        </div>
        <p className="user-name">{firstName} {lastName}</p>
        <p className="user-role">{USER_TYPE_LABELS[userType] || "Unknown"}</p>
      </div>
      <div className="sidebar-links">
        <ul>
          <li>
            <Link to={`/${userType}-dashboard`}>
              <span className="icon">📊</span> Dashboard
            </Link>
          </li>

          {userType === "dentist" && (
            <>
              <li>
                <Link to="/appointments">
                  <span className="icon">📅</span> Takvimi Gör
                </Link>
              </li>
              <li>
                <Link to="/add-appointment">
                  <span className="icon">➕</span> Randevu Geçmişi
                </Link>
              </li>
            </>
          )}

          {userType === "patient" && (
            <>
              <li>
                <Link to="/patient-appointments">
                  <span className="icon">📅</span> Randevularım
                </Link>
              </li>
              <li>
                <Link to="/choose">
                  <span className="icon">📅</span> Randevu Al
                </Link>
              </li>
            </>
          )}

          {userType === "assistant" && (
            <>
              <li>
                <Link to="/assistant-schedule">
                  <span className="icon">📋</span> Randevular
                </Link>
              </li>
              <li>
                <Link to="/manage-patient-records">
                  <span className="icon">📂</span> Randevu Ekle
                </Link>
              </li>
            </>
          )}

          {userType === "manager" && (
            <>
              <li>
                <Link to="/manage-staff">
                  <span className="icon">👥</span> Personel Ekle
                </Link>
              </li>
              <li>
                <Link to="/reports">
                  <span className="icon">📈</span> Personel Çıkar
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/profile">
              <span className="icon">⚙️</span> Profil
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
