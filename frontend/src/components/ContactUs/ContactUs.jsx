import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+503',
    phone: '',
    email: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const { countryCode } = formData;
      const maxLength = countryCode === '+503' ? 8 : 10;
      // Permitir solo números y limitar la longitud
      if (/^[0-9]*$/.test(value) && value.length <= maxLength) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo electrónico no es válido.';
    
    const phoneLength = formData.countryCode === '+503' ? 8 : 10;
    if (formData.phone.length !== phoneLength) {
      newErrors.phone = `El número debe tener ${phoneLength} dígitos.`;
    }

    if (!formData.comments.trim()) newErrors.comments = 'Los comentarios son obligatorios.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulario válido, enviando datos:', formData);
      // Aquí se podría añadir la lógica para enviar el formulario
    }
  };

  return (
    <section className="contact-us-container">
      <div className="contact-us">
        <h2 className="contact-us__title">Contactanos</h2>
        <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
          <div className="contact-us__form-group">
            <label htmlFor="name">Nombre y Apellido</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div className="contact-us__form-group">
            <label htmlFor="phone">Número telefónico</label>
            <div className="phone-input-group">
              <select name="countryCode" value={formData.countryCode} onChange={handleInputChange}>
                <option value="+503">SV (+503)</option>
                <option value="+1">US (+1)</option>
              </select>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          <div className="contact-us__form-group">
            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="contact-us__form-group">
            <label htmlFor="comments">Agrega tus comentarios</label>
            <textarea id="comments" name="comments" value={formData.comments} onChange={handleInputChange}></textarea>
            {errors.comments && <p className="error-text">{errors.comments}</p>}
          </div>
          <button type="submit" className="contact-us__submit-btn">Enviar</button>
          <p className="contact-us__footer-text">
            Te contactaremos lo más pronto posible, muchas gracias por tus comentarios.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
