import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Select from "../components/registro/selector/Select";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro2 = ({ nextStep, prevStep, formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si es el campo de teléfono, limita la longitud
    if (name === "phone") {
      const maxLength = formData.country === "sv" ? 8 : 10;
      if (value.length > maxLength) return;
      // Solo números
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const phoneRegex = /^\d+$/;

    const newErrors = {};

    if (!formData.email?.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Correo no válido.";

    if (!formData.phone?.trim()) newErrors.phone = "El teléfono es obligatorio.";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Solo números.";
    else {
      if (formData.country === "sv" && formData.phone.length !== 8)
        newErrors.phone = "Debe tener 8 dígitos para El Salvador.";
      else if (formData.country === "us" && formData.phone.length !== 10)
        newErrors.phone = "Debe tener 10 dígitos para EE.UU.";
    }

    if (!formData.contra?.trim()) newErrors.contra = "La contraseña es obligatoria.";
    else if (!passwordRegex.test(formData.contra)) {
      newErrors.contra = "Debe tener al menos 8 caracteres y un carácter especial.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      console.log("Paso 2 completado - Datos guardados:", formData);
      nextStep();
    } else {
      // Alerta visual si hay errores
      let mensaje = '';
      if (errors.email) mensaje += `${errors.email} <br>`;
      if (errors.contra) mensaje += `${errors.contra} <br>`;
      if (errors.phone) mensaje += `${errors.phone}`;
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
    <>
      <h2 className="recover-title">Detalles de la Cuenta</h2>
      <p>Asegura tu cuenta y elige cómo podemos contactarte.</p>

      <Input 
        label="Correo" 
        name="email" 
        value={formData.email || ""} 
        onChange={handleChange} 
      />
      {errors.email && <p className="error error-visible">{errors.email}</p>}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="contra"
        value={formData.contra || ""}
        onChange={handleChange}
        icon={
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        }
      />
      {errors.contra && <p className="error error-visible">{errors.contra}</p>}

      <Select
        label="Teléfono"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
        country={formData.country || "sv"}
        onCountryChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
      />
      {errors.phone && <p className="error error-visible">{errors.phone}</p>}

      <div className="navigation-buttons">
        <Button text="← Atrás" onClick={() => {
          console.log("Regresando al paso 1 - Datos actuales:", formData);
          prevStep();
        }} />
        <Button text="Siguiente →" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default Registro2;