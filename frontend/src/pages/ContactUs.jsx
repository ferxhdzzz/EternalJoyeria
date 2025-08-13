import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import useContactForm from '../hooks/ContactUs/useContactForm';
import '../styles/Contact.css';

const ContactUs = () => {
  const navigate = useNavigate();
  
  // Usar el hook personalizado
  const {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    handleChange,
    handleSubmit,
    clearMessages
  } = useContactForm();

  // Función para manejar el envío del formulario
  const onSubmit = (e) => {
    handleSubmit(e, '/api/contactus/send');
  };

  return (
    <>
      <Nav />
      
      <div className="contact-container">
        <section className="hero hero-product-banner">
          <div className="hero-product-content">
            <h1 className="hero-product-title">Contáctanos</h1>
          </div>
        </section>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Ubicación</h3>
                <p>El Salvador<br />San Salvador</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Teléfono</h3>
                <p>+503 1234-5678</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p>EternalJoyeria@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Horarios</h3>
                <p>Lun - Vie: 9:00 - 18:00<br />Sáb: 10:00 - 16:00</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="contact-form-card">
              <h2>Envíanos un mensaje</h2>
              <p className="form-subtitle">
                Completa el formulario y nos pondremos en contacto contigo pronto.
              </p>

              {/* Mensaje de éxito */}
              {submitSuccess && (
                <div className="success-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                  </svg>
                  ¡Mensaje enviado exitosamente! Te responderemos pronto.
                  <button 
                    onClick={clearMessages}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'inherit', 
                      cursor: 'pointer',
                      marginLeft: '10px',
                      fontSize: '18px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Mensaje de error */}
              {submitError && (
                <div className="error-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                  {submitError}
                  <button 
                    onClick={clearMessages}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'inherit', 
                      cursor: 'pointer',
                      marginLeft: '10px',
                      fontSize: '18px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={onSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Nombre completo *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? 'error' : ''}
                      placeholder="Tu nombre completo"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="tu@email.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+503 1234-5678"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Asunto *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'error' : ''}
                      placeholder="¿En qué podemos ayudarte?"
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    placeholder="Cuéntanos más sobre tu consulta..."
                    rows="6"
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="contact-map">
          <div className="map-placeholder">
            <div className="map-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
              <h3>Ubicación</h3>
              <p>San Salvador, El Salvador</p>
              <button className="map-button" onClick={() => window.open('https://www.google.com/maps/place/San+Salvador,+El+Salvador', '_blank')}>
                Ver en Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ContactUs;