import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import '../styles/NotFound.css';

// Página de error 404
const NotFound = () => {
  const navigate = useNavigate();

  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Nav />
      
      <div className="not-found-container">
        <div className="not-found-content">
          {/* Ilustración animada */}
          <div className="not-found-illustration">
            <div className="error-number">
              <span className="digit">4</span>
              <div className="zero-container">
                <span className="digit zero">0</span>
                <div className="face">
                  <div className="eyes">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                  </div>
                  <div className="mouth"></div>
                </div>
              </div>
              <span className="digit">4</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="not-found-text">
            <h1 className="error-title">¡Ups! Página no encontrada</h1>
            <p className="error-description">
              Lo sentimos, la página que buscas no existe o ha sido movida. 
              No te preocupes, aquí tienes algunas opciones para continuar.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="not-found-actions">
            <button 
              className="btn-primary"
              onClick={handleGoBack}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
              </svg>
              Volver atrás
            </button>
            
            <Link to="/" className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
              </svg>
              Ir al inicio
            </Link>
          </div>

          {/* Enlaces útiles */}
          <div className="useful-links">
            <h3>¿Buscas algo específico?</h3>
            <div className="links-grid">
              <Link to="/products" className="link-card">
                <div className="link-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="link-content">
                  <h4>Nuestros Productos</h4>
                  <p>Explora nuestra colección de joyería</p>
                </div>
              </Link>

              <Link to="/contact" className="link-card">
                <div className="link-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="link-content">
                  <h4>Contáctanos</h4>
                  <p>¿Necesitas ayuda? Estamos aquí</p>
                </div>
              </Link>

              <Link to="/about" className="link-card">
                <div className="link-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="link-content">
                  <h4>Sobre Nosotros</h4>
                  <p>Conoce más sobre Eternal Joyería</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="search-section">
            <h3>¿No encuentras lo que buscas?</h3>
            <p>Prueba buscando en nuestro sitio</p>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Buscar productos..."
                className="search-input"
              />
              <button className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default NotFound; 