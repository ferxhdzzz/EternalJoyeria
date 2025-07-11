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

    if (!formData.name?.trim()) newErrors.name = "El nombre es obligatorio.";
    else if (!nameRegex.test(formData.name)) newErrors.name = "El nombre solo puede contener letras.";

    if (!formData.lastName?.trim()) newErrors.lastName = "El apellido es obligatorio.";
    else if (!nameRegex.test(formData.lastName)) newErrors.lastName = "El apellido solo puede contener letras.";

    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Paso 1 completado - Datos guardados:", formData);
      nextStep();
    } else {
      // Alerta visual si hay errores
      let mensaje = '';
      if (newErrors.name) mensaje += `${newErrors.name} <br>`;
      if (newErrors.lastName) mensaje += `${newErrors.lastName}`;
      window.Swal && window.Swal.fire({
        title: 'Datos inválidos',
        html: mensaje,
        icon: 'error',
        confirmButtonColor: '#b94a6c',
        background: '#fff',
        customClass: {
          title: 'swal2-title-custom',
          popup: 'swal2-popup-custom',
        }
      });
    }
  };

  return (
    <form onSubmit={handleNext} noValidate>
      <h2 className="recover-title">Información Personal</h2>
      <p>Comencemos con tus datos básicos.</p>

      <Input 
        label="Nombre" 
        name="name" 
        value={formData.name || ""} 
        onChange={handleChange} 
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <Input 
        label="Apellido" 
        name="lastName" 
        value={formData.lastName || ""} 
        onChange={handleChange} 
      />
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