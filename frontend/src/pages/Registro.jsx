import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRegistro from "../hooks/Registro/useRegistro";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Select from "../components/registro/selector/Select";
import Label from "../components/registro/labels/LabelLog";
import Logo from "../components/registro/logo/Logo";
import BackArrow from "../components/registro/backarrow/BackArrow";
import PerfilFoto from "../components/registro/ProfilePic/PerfilFoto";
import BotonPerfil from "../components/registro/BotonPerfil/BotonPerfil";
import Stepper from "../components/Register/Stepper";
import EmailVerification from "../components/Register/EmailVerification";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro = () => {
  const navigate = useNavigate();
  const { loading, error, registerClient, clearError } = useRegistro();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    country: "sv",
    profilePhoto: null,
  });

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4)); // límite a paso 4
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    clearError();
    setValidationErrors({});

    if (name === "phone") {
      const maxLength = formData.country === "sv" ? 8 : 10;
      if (value.length > maxLength || !/^\d*$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [formData.country, clearError]);

  const validateStep1 = useCallback(() => {
    const errors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!formData.name?.trim()) {
      errors.name = "El nombre es obligatorio.";
    } else if (!nameRegex.test(formData.name)) {
      errors.name = "El nombre solo puede contener letras.";
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = "El apellido es obligatorio.";
    } else if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "El apellido solo puede contener letras.";
    }

    return errors;
  }, [formData.name, formData.lastName]);

  const validateStep2 = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!formData.email?.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Correo no válido.";
    }

    if (!formData.phone?.trim()) {
      errors.phone = "El teléfono es obligatorio.";
    } else {
      const phoneLength = formData.phone.length;
      if (formData.country === "sv" && phoneLength !== 8) {
        errors.phone = "Debe tener 8 dígitos para El Salvador.";
      } else if (formData.country === "us" && phoneLength !== 10) {
        errors.phone = "Debe tener 10 dígitos para EE.UU.";
      }
    }

    if (!formData.password?.trim()) {
      errors.password = "La contraseña es obligatoria.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Debe tener al menos 6 caracteres y un carácter especial.";
    }

    return errors;
  }, [formData.email, formData.phone, formData.password, formData.country]);

  const handleNext = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    let errors = {};
    
    switch (currentStep) {
      case 1:
        errors = validateStep1();
        break;
      case 2:
        errors = validateStep2();
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (currentStep === 2) {
      const result = await registerClient(formData);
      
      if (result.success) {
        nextStep();
      } else {
        console.error("Error en el registro:", result.error);
      }
    } else {
      nextStep();
    }
  }, [currentStep, formData, registerClient, validateStep1, validateStep2, nextStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      prevStep();
    } else {
      navigate("/");
    }
  }, [currentStep, prevStep, navigate]);

  const handleFileUpload = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
    }
  }, []);

  const handleTakePhoto = useCallback(() => {
    console.log("Función de tomar foto - Por implementar");
  }, []);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    
    input.click();
  }, [handleFileUpload]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleNext} noValidate>
            <h2 className="recover-title">Información Personal</h2>
            <p>Comencemos con tus datos básicos.</p>

            <Input 
              label="Nombre" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              disabled={loading}
            />
            {validationErrors.name && <p className="error">{validationErrors.name}</p>}

            <Input 
              label="Apellido" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              disabled={loading}
            />
            {validationErrors.lastName && <p className="error">{validationErrors.lastName}</p>}

            <div className="button-container">
              <Button 
                type="submit" 
                text={loading ? "Cargando..." : "Siguiente →"} 
                disabled={loading}
              />
            </div>
            <br />
            <Label textBefore="¿Ya tienes cuenta?" linkText="Inicia sesión" to="/login" />
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleNext} noValidate>
            <h2 className="recover-title">Detalles de la Cuenta</h2>
            <p>Asegura tu cuenta y elige cómo podemos contactarte.</p>

            <Input 
              label="Correo" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              disabled={loading}
            />
            {validationErrors.email && <p className="error error-visible">{validationErrors.email}</p>}

            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              icon={
                <span 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              }
            />
            {validationErrors.password && <p className="error error-visible">{validationErrors.password}</p>}

            <Select
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              country={formData.country}
              onCountryChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              disabled={loading}
            />
            {validationErrors.phone && <p className="error error-visible">{validationErrors.phone}</p>}

            {error && <p className="error error-visible">{error}</p>}

            <div className="navigation-buttons">
              <Button 
                type="button"
                text="← Atrás" 
                onClick={handlePrevStep} 
                disabled={loading} 
              />
              <Button 
                type="submit"
                text={loading ? "Registrando..." : "Siguiente →"} 
                disabled={loading}
              />
            </div>
          </form>
        );

      case 3:
        return (
          <div className="foto-paso">
            <Logo />
            <h2 className="recover-title">Foto de Perfil</h2>
            <h4>Paso 3</h4>

            <PerfilFoto 
              src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : "/gigi.png"} 
              size={140} 
            />
            
            <div className="botones-contenedor">
              <BotonPerfil 
                text="Tomar Foto" 
                color="#CE91A5" 
                onClick={handleTakePhoto} 
              />
              <BotonPerfil 
                text="Subir imagen" 
                color="#F9A5C0" 
                onClick={handleImageUpload} 
              />
            </div>

            <div className="navigation-buttons">
              <Button 
                type="button"
                text="← Atrás" 
                onClick={handlePrevStep} 
              />
              <Button 
                type="button"
                text="Siguiente →" 
                onClick={nextStep} 
              />
            </div>
          </div>
        );

      case 4:
        return (
          <EmailVerification 
            nextStep={() => navigate("/productos")} 
            prevStep={prevStep} 
            email={formData.email}
            loading={loading}
            error={error}
          />
        );

      default:
        navigate("/login");
        return null;
    }
  };

  return (
    <>
      <BackArrow onClick={handlePrevStep} />
      <Stepper currentStep={currentStep} />
      <div className="registro-content">
        {renderStep()}
      </div>
    </>
  );
};

export default Registro;