import React, { useState } from 'react';
import './ContactUs.css';
import TextInput from '../ui/Inputs/TextInput';
import EmailInput from '../ui/Inputs/EmailInput';
import TextareaInput from '../ui/Inputs/TextareaInput';

const ContactUs = () => {
  // Inicializa el estado para los datos del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    description: ''
  });

  // Inicializa el estado para los errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para mostrar mensaje de éxito
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
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
    
    // Validación de email (la validación básica se hace en el componente EmailInput)
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }
    
    // Validación de descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres.';
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
          description: ''
        });
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  return (
    <section className="contact-us-container">
      <div className="contact-us">
        <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
          <TextInput
            label="Nombre completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            placeholder="Tu nombre completo"
          />
          
          <EmailInput
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          
          <TextareaInput
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            placeholder="Cuéntanos cómo podemos ayudarte"
            maxLength={255}
          />
          
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
