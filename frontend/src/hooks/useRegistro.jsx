// Hook personalizado para el registro
import { useState } from 'react';

export const useRegistro = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    profilePicture: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const submitRegistration = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      formDataToSend.append('firstName', data.firstName);
      formDataToSend.append('lastName', data.lastName);
      formDataToSend.append('email', data.email);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('password', data.password);
      
      // Agregar la imagen si existe
      if (data.profilePicture) {
        formDataToSend.append('profilePicture', data.profilePicture);
      }

      const response = await fetch('localhost:4000/api/registerClients', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const result = await response.json();
      console.log('Registro exitoso:', result);
      return result;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async (email, code) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/registerClients/verifyCodeEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar el código');
      }

      const result = await response.json();
      console.log('Código verificado exitosamente:', result);
      return result;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    currentStep,
    nextStep,
    prevStep,
    submitRegistration,
    verifyEmailCode,
    loading,
    error
  };
};