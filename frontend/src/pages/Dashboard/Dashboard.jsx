import React, { useState } from 'react';
import './Dashboard.scss'; // SCSS dosyasını import ediyoruz

const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleClick = () => {
    setShowDashboard(true); // Butona tıklanınca dashboard mesajını göster
  };

  return (
    <div className="sidebar">
      <button onClick={handleClick} className="sidebar-button">Dashboard</button>
      {showDashboard && <div className="dashboard-message">Dashboard'a Hoşgeldiniz</div>}
    </div>
  );
};

export default Dashboard;
