import React, { useState, useEffect } from 'react';
import api from "../../api";
import './Choose.scss'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../sections/Footer/Footer';

const Choose = () => {
  const navigate = useNavigate();
  const [showAllServices, setShowAllServices] = useState(false);
  const [dentists, setDentists] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);

  useEffect(() => {
    const fetchDentists = async () => {
      api
        .get("/api/dentists/")
        .then((res) => res.data)
        .then((data) => {
            setDentists(data);
            console.log(data);
        })
        .catch((err) => alert(err));
    };

    fetchDentists();
  }, []);
  
  // Handle the selection of service and dentist
  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleDentistClick = (dentist) => {
    setSelectedDentist(dentist);
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedDentist) {
      alert('Lütfen hem hizmet hem de doktor seçin.');
      return;
    }
    navigate(`/schedule`, {
      state: { service: selectedService, dentist: selectedDentist },
    });
  };
  // Static list of services
  const services = [
    { id: 'teeth-cleaning-adult', name: 'DİŞ PROTEZİ', duration: '90 dk' },
    { id: 'emergency', name: 'İMPLANT', duration: '60 dk' },
    { id: 'invisalign-consult', name: 'DİŞ BEYAZLATMA', duration: '60 dk' },
    { id: 'teeth-cleaning-child', name: 'ORTADONTİ', duration: '60 dk' },
    { id: 'dental-implant', name: 'AĞIZ İÇİ BAKIM', duration: '120 dk' },
    { id: 'dental-implant', name: 'DİŞ TEMİZLİĞİ', duration: '120 dk' },
    { id: 'root-canal', name: 'KANAL TEDAVİ', duration: '90 dk' },
  ];

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Ne yaptırmak istersin?</h1>
        <div className="services-grid">
          {services.map((service) => (
            <div
              className={`service-box ${selectedService === service ? 'selected' : ''}`}
              onClick={() => handleServiceClick(service)}
              key={service.id}
            >
              <h2>{service.name}</h2>
              <div className="line-between"></div>
              <p className="duration">Süre: {service.duration}</p>
              <span className="arrow">→</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <h1>Doktorunuzu Seçiniz.</h1>
        {dentists.length > 0 ? (
          <div className="services-grid">
            {dentists.map((dentist) => (
              <div
                className={`service-box ${selectedDentist === dentist ? 'selected' : ''}`}
                onClick={() => handleDentistClick(dentist)}
                key={dentist.id}
              >
                <h2>{dentist.username}</h2>
                <div className="line-between"></div>
                <p className="specialty">{dentist.specialty}</p>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Doktor bilgileri yükleniyor...</p>
        )}
      </div>

      <div className="container">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Devam Et
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Choose;
