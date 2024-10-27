import React from 'react';
import './ThemeIcon.scss';

const ThemeIcon = (icon) => {
    return (
        <div className='icon-box'>
            <img src={icon.icon} alt="icon" />
        </div>
    );
};

export default ThemeIcon;