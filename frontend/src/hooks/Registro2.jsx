// Registro2.js (Paso 2)
import React, { useState } from "react";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Select from "../components/registro/selector/Select";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro2 = ({ nextStep, prevStep, registration }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { formData, updateFormData, validateStep2, registerClient, loading } = registration;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación específica para teléfono
    if (name === "phone") {
      const maxLength = formData.country === "sv" ? 8 : 10;
      if (value.length > maxLength) return;
      if (!/^\d*$/.test(value)) return;
    }
    
    updateFormData({ [name]: value });
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountryChange = (e) => {
    updateFormData({ 
      country: e.target.value,
      phone: '' 
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep2();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await registerClient();
        if (response.message === "Register successfully") {
          nextStep(); // Ir al paso 3
        } else {
          setErrors({ submit: response.message || 'Error en el registro' });
        }
      } catch (error) {
        setErrors({ submit: 'Error de conexión con el servidor' });
      }
    }
  };

  return (
    <>
      <h2 className="recover-title">Detalles de la Cuenta</h2>
      <p>Asegura tu cuenta y elige cómo podemos contactarte.</p>
      
      <Input 
        label="Correo" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
      />
      {errors.email && <p className="error error-visible">{errors.email}</p>}
      
      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        icon={
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        }
      />
      {errors.password && <p className="error error-visible">{errors.password}</p>}
      
      <Select
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        country={formData.country}
        onCountryChange={handleCountryChange}
      />
      {errors.phone && <p className="error error-visible">{errors.phone}</p>}
      
      {errors.submit && <p className="error error-visible">{errors.submit}</p>}
      
      <div className="navigation-buttons">
        <Button text="← Atrás" onClick={prevStep} />
        <Button 
          text={loading ? "Registrando..." : "Siguiente →"} 
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default Registro2;