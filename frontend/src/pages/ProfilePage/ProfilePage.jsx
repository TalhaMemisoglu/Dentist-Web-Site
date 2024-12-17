import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Profile from "../../components/Profile/Profile";
import "./ProfilePage.scss";

const ProfilePage = () => {
    return (
        <div className="profile-page-container">
            {/* Sidebar */}
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>

            {/* Profile Page */}
            <div className="profile-wrapper">
                <Profile />
            </div>
        </div>
    );
};

export default ProfilePage;