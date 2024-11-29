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

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Ne yaptırmak istersiniz?</h1>

        <div className="service-box" onClick={() => navigate('/teeth-cleaning-adult')}>
          <h2>DİŞ PROTEZİ (YETİŞKİN)</h2>
          <div className="line-between"></div>
          <p className="duration">Süre: 90 dk</p>
          <span className="arrow">→</span>
        </div>

        <div className="service-box" onClick={() => navigate('/emergency')}>
          <h2>İMPLANT</h2>
          <div className="line-between"></div>
          <p className="duration">Süre: 60 dk</p>
          <span className="arrow">→</span>
        </div>

        <div className="service-box" onClick={() => navigate('/invisalign-consult')}>
          <h2>DİŞ BEYAZLATMA</h2>
          <div className="line-between"></div>
          <p className="duration">Süre: 60 dk</p>
          <span className="arrow">→</span>
        </div>

        <div className="service-box" onClick={() => navigate('/teeth-cleaning-child')}>
          <h2>ORTADONTİ </h2>
          <div className="line-between"></div>
          <p className="duration">Süre: 60 dk</p>
          <span className="arrow">→</span>
        </div>

        {showAllServices && (
          <>
            <div className="service-box" onClick={() => navigate('/dental-implant')}>
              <h2>AĞIZ İÇİ BAKIM</h2>
              <div className="line-between"></div>
              <p className="duration">Süre: 120 dk</p>
              <span className="arrow">→</span>
            </div>
            <div className="service-box" onClick={() => navigate('/dental-implant')}>
              <h2>DİŞ TEMİZLİĞİ</h2>
              <div className="line-between"></div>
              <p className="duration">Süre: 120 dk</p>
              <span className="arrow">→</span>
            </div>

            <div className="service-box" onClick={() => navigate('/root-canal')}>
              <h2>KANAL TEDAVİ</h2>
              <div className="line-between"></div>
              <p className="duration">Süre: 90 dk</p>
              <span className="arrow">→</span>
            </div>
          </>
        )}

        
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
