import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
          navigate("/login"); // Redirect to the login page
          return;
        }

        const response = await axios.get("/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);

        // Print user details to the console
        const { username, user_type: userType, email, phone } = response.data;
        console.log("User Info:");
        console.log(`- Username: ${username}`);
        console.log(`- User Type: ${userType}`);
        console.log(`- Email: ${email || "No email provided"}`);
        console.log(`- Phone: ${phone || "No phone number provided"}`);
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
        <button className="home-button">
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
            <a href={`/${userType}-dashboard`}>
              <span className="icon">📊</span> Dashboard
            </a>
          </li>

          {userType === "dentist" && (
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

          {userType === "patient" && (
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
