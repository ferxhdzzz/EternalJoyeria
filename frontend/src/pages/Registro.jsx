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
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../styles/AuthStyles.css";

const Registro = () => {
  const navigate = useNavigate();
  const { loading, error, registerClient, verifyEmailCode, resendVerificationCode, clearError } = useRegistro();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estados adicionales para la verificación de email
  const [verificationCode, setVerificationCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  
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
    setCurrentStep(prev => Math.min(prev + 1, 4));
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

  // FUNCIÓN CORREGIDA - No salta pasos automáticamente
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

    // CORRECCIÓN: Solo registrar en paso 2, NO saltar al paso 4
    if (currentStep === 2) {
      const result = await registerClient(formData);
      
      if (result.success) {
        // Solo avanzar al paso 3 (foto de perfil)
        nextStep();
      } else {
        console.error("Error en el registro:", result.error);
      }
    } else {
      // Para los demás pasos, solo avanzar
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

  // NUEVA FUNCIÓN: Manejar verificación de código
  const handleVerifyCode = useCallback(async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setValidationErrors({ verificationCode: 'Por favor ingresa el código de verificación' });
      return;
    }

    clearError();
    setValidationErrors({});
    setResendMessage('');

    try {
      const result = await verifyEmailCode(verificationCode);
      
      if (result.success) {
        // CORRECCIÓN PRINCIPAL: Solo navegar si la verificación es exitosa
        console.log('Código verificado correctamente');
        navigate("/productos");
      } else {
        console.error('Error en verificación:', result.error);
      }
    } catch (err) {
      setValidationErrors({ verificationCode: 'Error al verificar el código' });
    }
  }, [verificationCode, verifyEmailCode, clearError, navigate]);

  // NUEVA FUNCIÓN: Reenviar código
  const handleResendCode = useCallback(async () => {
    clearError();
    setValidationErrors({});
    setResendMessage('');
    
    try {
      const result = await resendVerificationCode(formData.email);
      if (result.success) {
        setResendMessage('Código reenviado exitosamente a tu email');
      } else {
        setValidationErrors({ resend: result.error || 'Error al reenviar código' });
      }
    } catch (err) {
      setValidationErrors({ resend: 'Error al reenviar código' });
    }
  }, [formData.email, resendVerificationCode, clearError]);

  // NUEVA FUNCIÓN: Manejar cambio en código de verificación
  const handleCodeChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 6) {
      setVerificationCode(value);
      // Limpiar errores cuando el usuario empieza a escribir
      if (validationErrors.verificationCode) {
        setValidationErrors({});
      }
      if (error) clearError();
    }
  }, [validationErrors.verificationCode, error, clearError]);

  // Función para manejar cambios en campos individuales
  const handleCodeInputChange = useCallback((e, index) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    
    if (value.length <= 1) {
      const newCode = verificationCode.split('');
      newCode[index] = value;
      const updatedCode = newCode.join('').slice(0, 6);
      
      setVerificationCode(updatedCode);
      
      // Auto-focus al siguiente campo
      if (value && index < 5) {
        const nextInput = e.target.parentNode.children[index + 1];
        if (nextInput) nextInput.focus();
      }
      
      // Limpiar errores
      if (validationErrors.verificationCode) {
        setValidationErrors({});
      }
      if (error) clearError();
    }
  }, [verificationCode, validationErrors.verificationCode, error, clearError]);

  // Función para manejar teclas especiales
  const handleCodeKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = e.target.parentNode.children[index - 1];
      if (prevInput) prevInput.focus();
    }
  }, [verificationCode]);

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
          <form onSubmit={handleVerifyCode} noValidate>
            <h2 className="recover-title">Verificación de Email</h2>
            <p>Hemos enviado un código de verificación a:</p>
            <p style={{ fontWeight: 'bold', color: '#CE91A5', marginBottom: '10px' }}>
              {formData.email}
            </p>
            <p>Ingresa el código de 6 dígitos para completar tu registro.</p>

            {/* Campos individuales para el código */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={verificationCode[index] || ''}
                  onChange={(e) => handleCodeInputChange(e, index)}
                  onKeyDown={(e) => handleCodeKeyDown(e, index)}
                  disabled={loading}
                  style={{
                    width: '50px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '2px solid #E8E8E8',
                    borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: verificationCode[index] ? '#F8F8F8' : 'white',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#CE91A5';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E8E8E8';
                  }}
                />
              ))}
            </div>

            {validationErrors.verificationCode && (
              <p className="error error-visible">{validationErrors.verificationCode}</p>
            )}

            {error && <p className="error error-visible">{error}</p>}

            {resendMessage && (
              <p className="success success-visible">{resendMessage}</p>
            )}

            {validationErrors.resend && (
              <p className="error error-visible">{validationErrors.resend}</p>
            )}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#CE91A5',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {loading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
              </button>
            </div>

            <div className="navigation-buttons">
              <Button
                type="button"
                text="← Atrás"
                onClick={handlePrevStep}
                disabled={loading}
              />
              <Button
                type="submit"
                text={loading ? "Verificando..." : "Verificar y Completar →"}
                disabled={loading || !verificationCode.trim()}
              />
            </div>

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              <p>💡 Consejo: Revisa tu carpeta de spam si no ves el email.</p>
            </div>
          </form>
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