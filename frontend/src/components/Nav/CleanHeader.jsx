import React from 'react';
import CleanLogo from './CleanLogo';

const CleanHeader = ({ children, cartOpen, isMobile, isSmallMobile, menuOpen }) => {
    return (
        <header 
            className={menuOpen ? 'header header--menu-open' : 'header'}
            style={{
                width: '100%',
                position: 'fixed',
                top: isMobile ? '0' : '32px',
                left: 0,
                zIndex: cartOpen ? 9998 : 100,
                background: isMobile ? 'transparent' : undefined,
                boxShadow: isMobile ? 'none' : 'none',
                height: isMobile ? '60px' : 'auto',
                display: isMobile ? 'flex' : 'block',
                alignItems: isMobile ? 'center' : 'normal',
                // Force no effects
                transform: 'none !important',
                filter: 'none !important',
                transition: 'none !important',
                animation: 'none !important',
                backdropFilter: 'none !important',
                WebkitBackdropFilter: 'none !important'
            }}
        >
            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: isMobile ? '100%' : 'calc(70px + 1rem)',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: isMobile ? '0 clamp(0.75rem, 2vw, 1rem)' : '0 clamp(1rem, 3vw, 1.5rem)',
                    width: '100%',
                    // Force no effects
                    transform: 'none !important',
                    filter: 'none !important',
                    transition: 'none !important',
                    animation: 'none !important',
                    backdropFilter: 'none !important',
                    WebkitBackdropFilter: 'none !important'
                }}
            >
                <CleanLogo isMobile={isMobile} isSmallMobile={isSmallMobile} />
                {children}
            </div>
        </header>
    );
};

export default CleanHeader; 