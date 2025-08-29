import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.css';

const Error404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error404-container">
      <div className="error404-content">
        <div className="error404-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        
        <h1 className="error404-title">404</h1>
        <p className="error404-subtitle">Página no encontrada</p>
        <p className="error404-description">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="error404-buttons">
          <button 
            className="error404-btn error404-btn-secondary"
            onClick={handleGoBack}
          >
            Regresar
          </button>
          <button 
            className="error404-btn error404-btn-primary"
            onClick={handleGoHome}
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;
