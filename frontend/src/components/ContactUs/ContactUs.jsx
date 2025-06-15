import React, { useState } from 'react'; // Imports React and the useState hook for managing component state.
import './ContactUs.css'; // Imports the stylesheet for the ContactUs component.

// Defines the ContactUs functional component.
const ContactUs = () => {
  // Initializes the state for the form data using the useState hook.
  const [formData, setFormData] = useState({
    name: '', // Field for the user's name.
    countryCode: '+503', // Field for the selected country code, defaults to El Salvador.
    phone: '', // Field for the user's phone number.
    email: '', // Field for the user's email address.
    comments: '', // Field for the user's comments.
  });

  // Initializes the state for form validation errors.
  const [errors, setErrors] = useState({});

  // Handles changes in the input fields.
  const handleInputChange = (e) => {
    // Destructures the name and value from the event target (the input element).
    const { name, value } = e.target;

    // Special handling for the 'phone' input field.
    if (name === 'phone') {
      // Gets the current country code from the form data state.
      const { countryCode } = formData;
      // Sets the maximum allowed length for the phone number based on the country code.
      const maxLength = countryCode === '+503' ? 8 : 10;
      // Allows the update only if the value consists of digits and does not exceed the max length.
      if (/^[0-9]*$/.test(value) && value.length <= maxLength) {
        // Updates the state with the new value for the phone field.
        setFormData({ ...formData, [name]: value });
      }
    } else {
      // For all other fields, updates the state with the new value.
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validates the form data.
  const validateForm = () => {
    // Creates an empty object to store any new errors.
    const newErrors = {};
    // Checks if the name field is empty after trimming whitespace.
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    // Checks if the email field matches a standard email format.
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo electrónico no es válido.';
    
    // Determines the required phone number length based on the country code.
    const phoneLength = formData.countryCode === '+503' ? 8 : 10;
    // Checks if the phone number has the required length.
    if (formData.phone.length !== phoneLength) {
      newErrors.phone = `El número debe tener ${phoneLength} dígitos.`;
    }

    // Checks if the comments field is empty after trimming whitespace.
    if (!formData.comments.trim()) newErrors.comments = 'Los comentarios son obligatorios.';

    // Updates the errors state with any new errors found.
    setErrors(newErrors);
    // Returns true if no errors were found, and false otherwise.
    return Object.keys(newErrors).length === 0;
  };

  // Handles the form submission.
  const handleSubmit = (e) => {
    // Prevents the default browser behavior for form submission (page reload).
    e.preventDefault();
    // If the form is valid...
    if (validateForm()) {
      // Logs the form data to the console (placeholder for actual submission logic).
      console.log('Formulario válido, enviando datos:', formData);
      // Future logic for sending the form data to a server would go here.
    }
  };

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // The main container for the contact us section.
    <section className="contact-us-container">
      {/* The inner container for the form itself. */}
      <div className="contact-us">
        {/* The title of the contact form. */}
        <h2 className="contact-us__title">Contactanos</h2>
        {/* The form element with a submit handler and noValidate to disable default browser validation. */}
        <form className="contact-us__form" onSubmit={handleSubmit} noValidate>
          {/* A group for the name input field and its label. */}
          <div className="contact-us__form-group">
            {/* The label for the name input. */}
            <label htmlFor="name">Nombre y Apellido</label>
            {/* The text input for the user's name. */}
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            {/* Conditionally renders an error message if there is a name error. */}
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          {/* A group for the phone number input and its label. */}
          <div className="contact-us__form-group">
            {/* The label for the phone input. */}
            <label htmlFor="phone">Número telefónico</label>
            {/* A group for the country code selector and the phone number input. */}
            <div className="phone-input-group">
              {/* The dropdown for selecting the country code. */}
              <select name="countryCode" value={formData.countryCode} onChange={handleInputChange}>
                <option value="+503">SV (+503)</option> {/* Option for El Salvador. */}
                <option value="+1">US (+1)</option> {/* Option for the United States. */}
              </select>
              {/* The telephone input for the user's phone number. */}
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            {/* Conditionally renders an error message if there is a phone error. */}
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          {/* A group for the email input field and its label. */}
          <div className="contact-us__form-group">
            {/* The label for the email input. */}
            <label htmlFor="email">Correo</label>
            {/* The email input for the user's email address. */}
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            {/* Conditionally renders an error message if there is an email error. */}
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          {/* A group for the comments textarea and its label. */}
          <div className="contact-us__form-group">
            {/* The label for the comments textarea. */}
            <label htmlFor="comments">Agrega tus comentarios</label>
            {/* The textarea for the user's comments. */}
            <textarea id="comments" name="comments" value={formData.comments} onChange={handleInputChange}></textarea>
            {/* Conditionally renders an error message if there is a comments error. */}
            {errors.comments && <p className="error-text">{errors.comments}</p>}
          </div>
          {/* The submit button for the form. */}
          <button type="submit" className="contact-us__submit-btn">Enviar</button>
          {/* A footer text to inform the user about the next steps. */}
          <p className="contact-us__footer-text">
            Te contactaremos lo más pronto posible, muchas gracias por tus comentarios.
          </p>
        </form>
      </div>
    </section>
  );
};

// Exports the ContactUs component to be used in other parts of the application.
export default ContactUs;
