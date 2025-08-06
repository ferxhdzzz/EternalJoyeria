import React from 'react';
import CleanLogo from './CleanLogo';

const CleanHeader = ({ children, cartOpen, isMobile, isSmallMobile, isTinyMobile, menuOpen }) => {
    // Determinar el padding basado en el tamaño de pantalla
    const getPadding = () => {
        if (isTinyMobile) {
            return '0 0.05rem';
        } else if (isSmallMobile) {
            return '0 0.1rem';
        } else if (isMobile) {
            return '0 clamp(0.15rem, 1vw, 0.4rem)';
        } else {
            return '0 clamp(0.3rem, 2vw, 0.8rem)';
        }
    };

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
                    maxWidth: '1300px',
                    margin: '0 auto',
                    padding: getPadding(),
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