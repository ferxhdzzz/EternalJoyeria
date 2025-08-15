import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir números en el campo de teléfono
    if (name === "telefono") {
      // Eliminar cualquier caracter que no sea número
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }
    
    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es obligatorio';
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio';
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simular envío del formulario
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: ''
        });
        
        // Mostrar mensaje de éxito por 3 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      }, 1500);
    } else {
      setErrors(newErrors);
    }
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
                <h3>Correo electrónico</h3>
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

              {submitSuccess && (
                <div className="success-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                  </svg>
                  ¡Mensaje enviado exitosamente! Te responderemos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={errors.nombre ? 'error' : ''}
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Tu correo electrónico"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+503 1234-5678"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto">Asunto *</label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      className={errors.asunto ? 'error' : ''}
                      placeholder="¿En qué podemos ayudarte?"
                    />
                    {errors.asunto && <span className="error-message">{errors.asunto}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    className={errors.mensaje ? 'error' : ''}
                    placeholder="Cuéntanos más sobre tu consulta..."
                    rows="6"
                  ></textarea>
                  {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
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

        {/* Sección del mapa embebido */}
        <div className="contact-map">
          <div className="map-container">
            <h3 className="map-title">Nuestra Ubicación</h3>
            <p className="map-subtitle">San Salvador, El Salvador</p>
            
            {/* Mapa embebido de Google Maps */}
            <div className="map-iframe-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124225.123456789!2d-89.1875!3d13.6929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f633067b3a5a8a5%3A0x1b1b1b1b1b1b1b1b!2sSan+Salvador%2C+El+Salvador!5e0!3m2!1ses!2ses!4v1234567890123"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Eternal Joyería en San Salvador, El Salvador"
              ></iframe>
            </div>
            
            {/* Información adicional del mapa */}
            <div className="map-info">
              <div className="map-info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>Centro de San Salvador</span>
              </div>
              <div className="map-info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
                <span>Fácil acceso y estacionamiento disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;