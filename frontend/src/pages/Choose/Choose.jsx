import React, { useState } from 'react';
import './Choose.scss'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';

const Choose = () => {
  const navigate = useNavigate();
  const [showAllServices, setShowAllServices] = useState(false);

  const toggleServices = () => {
    setShowAllServices(!showAllServices);
  };

  // Static list of services
  const services = [
    { id: 'teeth-cleaning-adult', name: 'DİŞ PROTEZİ (YETİŞKİN)', duration: '90 dk' },
    { id: 'emergency', name: 'İMPLANT', duration: '60 dk' },
    { id: 'invisalign-consult', name: 'DİŞ BEYAZLATMA', duration: '60 dk' },
    { id: 'teeth-cleaning-child', name: 'ORTADONTİ', duration: '60 dk' },
    { id: 'dental-implant', name: 'AĞIZ İÇİ BAKIM', duration: '120 dk' },
    { id: 'dental-implant', name: 'DİŞ TEMİZLİĞİ', duration: '120 dk' },
    { id: 'root-canal', name: 'KANAL TEDAVİ', duration: '90 dk' },
  ];

  // Handle the service click and pass the service to the booking page
  const handleServiceClick = (service) => {
    navigate(`/schedule`, { state: { service } }); // Pass selected service to next page
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Ne yaptırmak istersin?</h1>

        {/* Render limited services */}
        {services.slice(0, 4).map(service => (
          <div className="service-box" onClick={() => handleServiceClick(service)} key={service.id}>
            <h2>{service.name}</h2>
            <div className="line-between"></div>
            <p className="duration">Süre: {service.duration}</p>
            <span className="arrow">→</span>
          </div>
        ))}

        {/* Render additional services when toggle is active */}
        {showAllServices && (
          <>
            {services.slice(4).map(service => (
              <div className="service-box" onClick={() => handleServiceClick(service)} key={service.id}>
                <h2>{service.name}</h2>
                <div className="line-between"></div>
                <p className="duration">Süre: {service.duration}</p>
                <span className="arrow">→</span>
              </div>
            ))}
          </>
        )}

        {/* Button to toggle between showing more services */}
        <div className="load-more-btn-container">
          <button className="load-more-btn" onClick={toggleServices}>
            {showAllServices ? 'Daha Az Göster' : 'Tüm Servisleri Göster'}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Choose;
