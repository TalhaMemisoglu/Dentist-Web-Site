import React from 'react';
import { Link } from 'react-router-dom';
import ThemeIcon from '../ThemeIcon/ThemeIcon';
import './Service.scss';

const Service = ({serviceList}) => {
    const {title,description, icon} = serviceList;
 
    return (
        <div className='col-lg-3 col-md-4 col-sm-6'>
           <div className="service-box">
                <div className="service-icon">
                    <div className='icon-area'>
                    <ThemeIcon icon={icon} />
                    </div>
                </div>
                <div className="service-text">
                    <h3><Link to="/singleservice">{title}</Link></h3>
                    <p>{description}</p>
                </div>
           </div>
        </div>
    );
};

export default Service;