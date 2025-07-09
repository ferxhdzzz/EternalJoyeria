import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/registro/inpungroup/InputGroup";
import Button from "../components/registro/button/Button";
import Logo from "../components/registro/logo/Logo";
import "../styles/AuthStyles.css";

const VerifyEmail = ({ registration }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  
  const { formData, verifyEmailCode, resendVerificationCode, loading } = registration;

  // Countdown para reenvío de código
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Validación del código (solo números, máximo 6 dígitos)
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('El código de verificación es obligatorio');
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    try {
      const response = await verifyEmailCode(verificationCode);
      if (response.message === "Email verified successfully") {
        navigate("/products");
      } else {
        setError(response.message || 'Código de verificación incorrecto');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleResendCode = async () => {
    try {
      setResendCooldown(60); // 60 segundos de espera
      const response = await resendVerificationCode();
      
      if (response.message === "Verification code resent successfully") {
        setError(''); // Limpiar errores
        // Opcionalmente mostrar mensaje de éxito
        console.log('Código reenviado exitosamente');
      } else {
        setError(response.message || 'Error al reenviar el código');
        setResendCooldown(0);
      }
    } catch (error) {
      setError('Error al reenviar el código');
      setResendCooldown(0);
    }
  };

  // Protección: si no hay email, redirigir al registro
  useEffect(() => {
    if (!formData?.email) {
      navigate("/registro");
    }
  }, [formData?.email, navigate]);

  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    const masked = localPart.slice(0, 2) + '*'.repeat(localPart.length - 2);
    return `${masked}@${domain}`;
  };

  return (
    <div className="recover-wrapper">
      <div className="recover-card">
        <Logo />
        <h2 className="recover-title">Verificar Email</h2>
        <p>
          Hemos enviado un código de verificación a{' '}
          <strong>{maskEmail(formData?.email)}</strong>
        </p>
        <p className="text-small">
          El código expira en 10 minutos. Revisa tu bandeja de spam si no lo encuentras.
        </p>

        <form onSubmit={handleSubmit}>
          <Input 
            label="Código de verificación" 
            name="verificationCode" 
            value={verificationCode} 
            onChange={handleCodeChange}
            placeholder="123456"
            maxLength="6"
            style={{ 
              textAlign: 'center', 
              fontSize: '1.2em', 
              letterSpacing: '0.3em' 
            }}
          />
          
          {error && <p className="error">{error}</p>}
          
          <Button 
            type="submit" 
            text={loading ? "Verificando..." : "Verificar"} 
            disabled={loading || verificationCode.length !== 6}
          />
        </form>

        <div className="resend-section">
          <p className="text-small">¿No recibiste el código?</p>
          <Button
            text={
              resendCooldown > 0 
                ? `Reenviar en ${resendCooldown}s` 
                : "Reenviar código"
            }
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || loading}
            variant="secondary" // Asumiendo que tienes un estilo secundario
          />
        </div>

        <div className="help-section">
          <Button
            text="← Cambiar email"
            onClick={() => navigate("/registro2")}
            variant="link" // Asumiendo que tienes un estilo de link
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;