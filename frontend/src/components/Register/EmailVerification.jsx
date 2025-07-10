import React, { useState, useEffect } from 'react';
import './EmailVerification.css';

const EmailVerification = ({ nextStep, prevStep }) => {
    const [code, setCode] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendCode = () => {
    // Aquí iría la lógica para reenviar el código al backend
    console.log("Resending verification code...");
    setIsResendDisabled(true);
    setTimer(60); // Inicia el temporizador de 60 segundos
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

    //Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que el código tenga 6 dígitos numéricos
    const codeStr = code.join("");
    if (!/^\d{6}$/.test(codeStr)) {
      setError("El código debe tener exactamente 6 dígitos numéricos.");
      return;
    }
    setError("");
    // Aquí se verificaría el código con el backend
    console.log("Verifying code:", codeStr);
    nextStep();
  };

  return (
    <div className="email-verification-form">
      <h2>Verificación de Correo</h2>
      <p>Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación.</p>
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((data, index) => {
            return (
              <input
                className="code-input"
                type="text"
                name="code"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            );
          })}
        </div>
        {error && <p className="error-text" style={{textAlign:'center',marginTop:8}}>{error}</p>}
        <div className="resend-container">
          <button type="button" onClick={handleResendCode} disabled={isResendDisabled} className="resend-btn">
            {isResendDisabled ? `Enviar de nuevo en ${timer}s` : "Enviar código nuevamente"}
          </button>
        </div>
        <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" className="primary-btn">Verificar y Continuar</button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;
