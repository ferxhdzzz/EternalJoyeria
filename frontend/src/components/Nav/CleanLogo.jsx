import React from 'react';
import { Link } from 'react-router-dom';

const CleanLogo = ({ isMobile, isSmallMobile }) => {
    const logoHeight = isSmallMobile ? '40px' : isMobile ? '50px' : '70px';
    
    return (
        <Link 
            to="/" 
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'none',
                padding: 0,
                border: 'none',
                textDecoration: 'none',
                cursor: 'pointer',
                // Force override any global styles
                transform: 'none !important',
                filter: 'none !important',
                transition: 'none !important',
                animation: 'none !important',
                boxShadow: 'none !important',
                backdropFilter: 'none !important',
                WebkitBackdropFilter: 'none !important'
            }}
        >
            <img 
                src="/Products/EternalLogo.png" 
                alt="Eternal Joyeria Logo" 
                style={{
                    height: logoHeight,
                    width: 'auto',
                    display: 'block',
                    // Force override any global styles
                    transform: 'none !important',
                    filter: 'none !important',
                    transition: 'none !important',
                    animation: 'none !important',
                    boxShadow: 'none !important',
                    backdropFilter: 'none !important',
                    WebkitBackdropFilter: 'none !important',
                    // Additional properties to prevent any effects
                    objectFit: 'contain',
                    objectPosition: 'center',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto',
                    MozImageRendering: 'auto'
                }}
            />
        </Link>
    );
};

export default CleanLogo; 