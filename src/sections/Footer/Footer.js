import React from 'react';
import logo from '../../assets/footer_logo.png';
import './Footer.scss';
import { FaFacebookF, FaInstagram, FaTwitter} from "react-icons/fa";
import { Link } from 'react-router-dom';
import call from '../../assets/footer/calling.png';
import time from '../../assets/footer/time.png';
import location from '../../assets/footer/location.png';

const Footer = () => {

    const footerMenu = [
        // {
        //     'name' : 'Hakkımızda',
        //     'link' : '/'
        // },
        // {
        //     'name' : 'Hizmetlerimiz',
        //     'link' : '/'
        // },
        {
            'name' : 'SSS',
            'link' : '/'
        }
    ];

    const footerContacts = [
        {
            'title': 'Telefon Numaramız',
            'info': '+088 123 654 987',
            'icon': call
        },
        {
            'title': 'Çalışma Saatlerimiz',
            'info': '09:00  - 18:00 ',
            'icon': time
        },
        {
            'title': 'Adresimiz',
            'info': 'Adana',
            'icon': location
        }
    ]

    return (
        <footer className='pt-100 pb-70'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        {/* Left column: Logo and Social Icons */}
                        <div className="footer-logo">
                            <img src={logo} alt="logo" />
                        </div>

                        <div className="footer-link">
                            {/* <p>HIZLI LİNKLER</p> */}
                        
                            <ul>
                                {
                                    footerMenu.map(singleMenu => <li><Link to="/">{singleMenu.name}</Link></li>)
                                }
                            </ul>
                        </div>

                        <div className="social-logo">
                            <p>BİZİ TAKİP EDİN</p>
                            <ul className='d-flex'>
                                <li><a href="/"><FaFacebookF/></a></li>
                                <li><a href="/"><FaTwitter/></a></li>
                                <li><a href="/"><FaInstagram/></a></li>
                            </ul>
                        </div>

                        
                    
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="footer-contact">
                            {/* <p>İLETİŞİM & BİLGİ</p> */}

                            {
                                footerContacts.map(footerContact => {
                                    return  <div className="contact-list">
                                                <div className="contact-icon">
                                                    <img src={footerContact.icon} alt="call" />
                                                </div>
                                                <div className="contact-text-block">
                                                    <p>{footerContact.title}</p>
                                                    <h5>{footerContact.info}</h5>
                                                </div>
                                            </div>
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="copyright-area">
                    <div className='copy-text'>
                        <p>&copy; Dentalist.Bütün hakları saklıdır.</p>
                    </div>  
                    <div className='copy-links'>
                        <ul>
                            <li><Link to='/'>Kullanıcı koşulları</Link></li>
                            <li><Link to='/'>Gizlilik sözleşmesi</Link></li>
                        </ul>
                    </div>                          
                </div>
            </div>
        </footer>
    );
};

export default Footer;