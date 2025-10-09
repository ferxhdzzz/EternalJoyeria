import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer";
import useContactForm from "../hooks/ContactUs/useContactForm";
import "../styles/Contact.css";

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
    clearMessages,
    isFormValid,
  } = useContactForm();

  // Función para manejar el cambio en el campo de teléfono
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Solo permitir números, espacios, guiones y el signo +, máximo 15 caracteres
    const phoneRegex = /^[0-9\s\-+]*$/;

    if (phoneRegex.test(value) && value.length <= 15) {
      handleChange(e);
    }
  };

  // Función para manejar el envío del formulario
  const onSubmit = (e) => {
    handleSubmit(e, "/api/contactus/send");
  };

  // Scroll al top cuando hay errores para mejor UX
  useEffect(() => {
    if (submitError && Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector(".error");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [errors, submitError]);

  // Auto-dismiss de mensajes después de un tiempo
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(clearMessages, 8000); // 8 segundos
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, clearMessages]);

  return (
    <>
      <Nav />

      <div className="contact-container">
        <section className="hero hero-product-banner">
          <div className="hero-product-content">
            <h1 className="hero-product-title">Contáctanos</h1>
            <p className="hero-subtitle">
              Estamos aquí para ayudarte. Envíanos tu consulta y te
              responderemos pronto.
            </p>
          </div>
        </section>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Ubicación</h3>
                <p>
                  El Salvador
                  <br />
                  San Salvador
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Teléfono</h3>
                <p>+503 1234-5678</p>
                <small>WhatsApp disponible</small>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p>EternalJoyeria@gmail.com</p>
                <small>Respuesta en 24 horas</small>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Horarios</h3>
                <p>
                  Lun - Vie: 9:00 - 18:00
                  <br />
                  Sáb: 10:00 - 16:00
                </p>
                <small>Dom: Cerrado</small>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="contact-form-card">
              <h2>Envíanos un mensaje</h2>
              <p className="form-subtitle">
                Completa el formulario y nos pondremos en contacto contigo
                pronto.
              </p>

              {/* Mensaje de éxito */}
              {submitSuccess && (
                <div className="success-message" role="alert">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      fill="currentColor"
                    />
                  </svg>
                  ¡Mensaje enviado exitosamente! Te responderemos pronto.
                  <button
                    onClick={clearMessages}
                    aria-label="Cerrar mensaje de éxito"
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "18px",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Mensaje de error */}
              {submitError && (
                <div className="error-message" role="alert">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      fill="currentColor"
                    />
                  </svg>
                  {submitError}
                  <button
                    onClick={clearMessages}
                    aria-label="Cerrar mensaje de error"
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "18px",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={onSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Nombre completo *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "error" : ""}
                      placeholder="Tu nombre completo"
                      required
                      aria-invalid={errors.fullName ? "true" : "false"}
                      aria-describedby={
                        errors.fullName ? "fullName-error" : undefined
                      }
                    />
                    {errors.fullName && (
                      <span
                        id="fullName-error"
                        className="error-message"
                        role="alert"
                      >
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                      placeholder="tu@email.com"
                      required
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <span
                        id="email-error"
                        className="error-message"
                        role="alert"
                      >
                        {errors.email}
                      </span>
                    )}
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
                      onChange={handlePhoneChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="+503 1234-5678"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    {errors.phone && (
                      <span
                        id="phone-error"
                        className="error-message"
                        role="alert"
                      >
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Asunto *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? "error" : ""}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      aria-invalid={errors.subject ? "true" : "false"}
                      aria-describedby={
                        errors.subject ? "subject-error" : undefined
                      }
                    />
                    {errors.subject && (
                      <span
                        id="subject-error"
                        className="error-message"
                        role="alert"
                      >
                        {errors.subject}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "error" : ""}
                    placeholder="Cuéntanos más sobre tu consulta..."
                    rows="6"
                    required
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  ></textarea>
                  {errors.message && (
                    <span
                      id="message-error"
                      className="error-message"
                      role="alert"
                    >
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? "loading" : ""} ${
                    !isFormValid ? "disabled" : ""
                  }`}
                  disabled={isSubmitting || !isFormValid}
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="loading-spinner"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>

                <p id="submit-help" className="form-help">
                  Los campos marcados con * son obligatorios
                </p>
              </form>
            </div>
          </div>
        </div>{" "}
        <div className="contact-map">
          {/* **NUEVA ESTRUCTURA PARA EL MAPA INCRUSTADO** */}{" "}
          <iframe
            title="Ubicación de la Joyería en Google Maps"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerpolicy="no-referrer-when-downgrade" // REEMPLAZA ESTE 'src' CON EL CÓDIGO EMBED REAL DE TU UBICACIÓN // EJEMPLO CON COORDENADAS DE EL SALVADOR:
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7752.408847505854!2d-89.22062482229002!3d13.706065400000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f63312cffdc0e23%3A0xfd208b3a87cfb4d9!2sMetrocentro%20San%20Salvador!5e0!3m2!1ses!2ssv!4v1760018543579!5m2!1ses!2ssv"
          ></iframe>{" "}
        </div>{" "}
      </div>

      <Footer />
    </>
  );
};
//
export default ContactUs;


