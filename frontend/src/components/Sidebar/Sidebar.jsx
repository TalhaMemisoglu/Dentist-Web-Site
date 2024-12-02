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
        if (!token) {
          console.warn("No token found. Redirecting to login...");
          navigate("/login"); // Eğer token yoksa giriş sayfasına yönlendir
          return;
        }

        const response = await axios.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const { user_type: userType, username } = user;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button 
          className="home-button"
          onClick={() => navigate('/')} // Anasayfa rotasına yönlendirme
        >
          <span className="home-icon">🏠</span> Anasayfa
        </button>
      </div>
      <div className="profile-section">
        <div className="profile-image">
          <img src={profilePhoto} alt="Profile" />
        </div>
        <p className="user-name">{username}</p>
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
                  <span className="icon">📅</span> Randevular
                </Link>
              </li>
              <li>
                <Link to="/add-appointment">
                  <span className="icon">➕</span> Randevu Ekle
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
