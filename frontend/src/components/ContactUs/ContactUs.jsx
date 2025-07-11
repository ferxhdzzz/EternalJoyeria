import React, { useState } from 'react';
import './ContactUs.css';
import Input from '../registro/inpungroup/InputGroup';

const ContactUs = () => {
  // Inicializa el estado para los datos del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    description: '',
    privacy: false
  });

  // Inicializa el estado para los errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para mostrar mensaje de éxito
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Valida el formulario antes de enviarlo
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio.';
    }
    
    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }

    // Validación de teléfono (opcional, pero si se llena debe ser válido)
    if (formData.phone.trim()) {
      // Permite números, espacios, guiones y paréntesis, mínimo 8 dígitos
      if (!/^[- +()0-9]{8,}$/.test(formData.phone.trim())) {
        newErrors.phone = 'El teléfono debe ser válido (mínimo 8 dígitos, solo números y símbolos).';
      }
    }

    // Validación de asunto
    if (!formData.subject) {
      newErrors.subject = 'Selecciona un asunto.';
    }
    
    // Validación de descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres.';
    }

    // Validación de privacidad
    if (!formData.privacy) {
      newErrors.privacy = 'Debes aceptar el aviso de privacidad.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí iría la lógica para enviar los datos a un servidor
      console.log('Formulario válido, enviando datos:', formData);
      
      // Muestra el mensaje de éxito
      setSubmitSuccess(true);
      
      // Limpia el formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          description: '',
          privacy: false
        });
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  return (
    <section className="contact-us-container">
      <div className="contact-us">
        <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nombre completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          
          <Input
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Teléfono (opcional) */}
          <Input
            label="Teléfono (opcional)"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          {/* Asunto (desplegable) */}
          <div className="contact-us__form-group">
            <label className="input-label" htmlFor="subject">Asunto</label>
            <select
              id="subject"
              name="subject"
              className="input"
              value={formData.subject}
              onChange={handleInputChange}
              required
              style={{ width: '100%' }}
            >
              <option value="">Selecciona una opción</option>
              <option value="consulta">Consulta</option>
              <option value="pedido">Pedido</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="otro">Otro</option>
            </select>
            {errors.subject && <p className="error-text">{errors.subject}</p>}
          </div>

          <div className="input-wrapper">
            <label className="input-label">Descripción</label>
            <div className="input-container">
              <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
                className="input"
            placeholder="Cuéntanos cómo podemos ayudarte"
            maxLength={255}
                style={{ minHeight: '80px', resize: 'none' }}
              />
            </div>
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>

          {/* Checkbox de privacidad */}
          <div className="contact-us__form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              id="privacy"
              name="privacy"
              checked={formData.privacy}
              onChange={handleInputChange}
              style={{ width: '18px', height: '18px' }}
              required
            />
            <label htmlFor="privacy" style={{ fontSize: '0.95rem', color: '#b94a6c', fontWeight: 500, cursor: 'pointer', marginTop: '0.5rem' }}>
              Acepto el <a href="/aviso-privacidad" target="_blank" rel="noopener noreferrer" style={{ color: '#b94a6c', textDecoration: 'underline' }}>aviso de privacidad</a>
            </label>
          </div>
          {errors.privacy && <p className="error-text">{errors.privacy}</p>}
          
          <button type="submit" className="contact-us__submit-btn">
            Enviar
          </button>
          {submitSuccess && (
            <p className="success-message">
              Mensaje enviado con éxito. ¡Gracias por contactarnos!
            </p>
          )}
          <p className="contact-us__footer-text">
            Te contactaremos lo más pronto posible. Gracias por tus comentarios.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
