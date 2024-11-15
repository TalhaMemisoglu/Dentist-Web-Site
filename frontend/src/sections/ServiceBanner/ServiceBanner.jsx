import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceBanner.scss';
import serviceBanner1 from '../../assets/servicePage/1.png';
import serviceBanner2 from '../../assets/servicePage/2.png';
import serviceBanner3 from '../../assets/servicePage/3.png';
import serviceBanner4 from '../../assets/servicePage/4.png';
import serviceBanner5 from '../../assets/servicePage/5.png';
import serviceBanner6 from '../../assets/servicePage/6.png';
import serviceBanner7 from '../../assets/servicePage/7.png';
import serviceBanner8 from '../../assets/servicePage/8.png';

const services = [
    {
        title: 'Kanal Tedavi',
        description: 'Kanal tedavisi, dişin iç kısmındaki enfekte olmuş dokuyu temizleyip, dişi koruyarak ağrı ve iltihapları giderdiği için dişi kaybetmekten korur ve ağrısız bir yaşam sağlar.',
        image: serviceBanner1,
        link: '/'
    },
    {
        title: 'Diş Protezi',
        description: 'Diş protezleri kaybedilen dişlerin yerine geçerek doğal görünüm ve fonksiyon sağlar.',
        image: serviceBanner2,
        link: '/'
    },
    {
        title: 'İmplant',
        description: 'Diş implantları, kaybolan dişlerin yerine konan kalıcı çözümler sunar.',
        image: serviceBanner3,
        link: '/'
    },
    {
        title: 'Beyazlatma',
        description: 'Diş beyazlatma, dişlerinizin doğal parlaklığını geri kazandırır.',
        image: serviceBanner4,
        link: '/'
    },
    {
        title: 'Ortodonti',
        description: 'Ortodontik tedavi, dişlerinizi hizalayarak düzgün bir gülüş sağlar.',
        image: serviceBanner5,
        link: '/'
    },
    {
        title: 'Diş Çekimi',
        description: 'Diş çekimi, dişlerinizin sağlığını korumak için bazen gerekli olabilir.',
        image: serviceBanner6,
        link: '/'
    },
    {
        title: 'Ağız İçi Bakım',
        description: 'Ağız içi bakım, sağlıklı bir ağız yapısına sahip olmanıza yardımcı olur.',
        image: serviceBanner7,
        link: '/'
    },
    {
        title: 'Diş Temizliği',
        description: 'Diş temizliği, dişlerinizdeki taşlardan kurtulmak için güzel bir tedavidir.',
        image: serviceBanner8,
        link: '/'
    }

];

const ServiceBanner = () => {
    return (
        <>
            {services.map((service, index) => (
                <section key={index} className='service-banner-section section-common section-bg'>
                    <div className="d-table">
                        <div className="d-table-cell">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-5 col-md-6">
                                        <div className="service-banner-text" data-aos="fade-up" data-aos-duration="2000">
                                            <h2>{service.title}</h2>
                                            <p>{service.description}</p>
                                            <div className="theme-btn">
                                                <Link to={service.link}>Randevu al</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-6">
                                        <div className="service-banner-img" data-aos="fade-up" data-aos-duration="2000">
                                            <img src={service.image} alt={service.title} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
};

export default ServiceBanner;
