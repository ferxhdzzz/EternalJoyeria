// Registro.js (Paso 1)
import React, { useState } from "react";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Label from "../components/registro/labels/LabelLog";
import "../styles/AuthStyles.css";

const Registro = ({ nextStep, registration }) => {
  const [errors, setErrors] = useState({});
  const { formData, updateFormData, validateStep1 } = registration;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Limpiar error específico cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} noValidate>
      <h2 className="recover-title">Información Personal</h2>
      <p>Comencemos con tus datos básicos.</p>
      
      <Input 
        label="Nombre" 
        name="firstName" 
        value={formData.firstName} 
        onChange={handleChange} 
      />
      {errors.firstName && <p className="error">{errors.firstName}</p>}
      
      <Input 
        label="Apellido" 
        name="lastName" 
        value={formData.lastName} 
        onChange={handleChange} 
      />
      {errors.lastName && <p className="error">{errors.lastName}</p>}
      
      {/* Se eliminó el campo de "Usuario" */}
      
      <div className="button-container">
        <Button type="submit" text="Siguiente →" />
      </div>
      
      <br />
      <Label textBefore="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
    </form>
  );
};

export default Registro;
