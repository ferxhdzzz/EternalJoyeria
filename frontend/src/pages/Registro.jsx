// Registro.js (Paso 1)
import React, { useState } from "react";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Label from "../components/registro/labels/LabelLog";

import "../styles/AuthStyles.css";

const Registro = ({ nextStep, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio.";
    else if (!nameRegex.test(formData.firstName)) newErrors.firstName = "El nombre solo puede contener letras.";

    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    else if (!nameRegex.test(formData.lastName)) newErrors.lastName = "El apellido solo puede contener letras.";

    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleNext} noValidate>
      <h2 className="recover-title">Información Personal</h2>
      <p>Comencemos con tus datos básicos.</p>

      <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} />
      {errors.firstName && <p className="error">{errors.firstName}</p>}

      <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} />
      {errors.lastName && <p className="error">{errors.lastName}</p>}
      
      <div className="button-container">
        <Button type="submit" text="Siguiente →" />
      </div>
      <br />
      <Label textBefore="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
    </form>
  );
};

export default Registro;