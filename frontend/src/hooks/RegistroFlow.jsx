// Componente principal que maneja todos los pasos
import React from 'react';
import { useRegistro } from './hooks/useRegistro';
import Registro from './Registro';
import Registro2 from './Registro2';
import RegistroPaso2 from './RegistroPaso2';

const RegistroFlow = () => {
  const {
    formData,
    setFormData,
    currentStep,
    nextStep,
    prevStep,
    submitRegistration,
    loading,
    error
  } = useRegistro();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Registro
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <Registro2
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <RegistroPaso2
            prevStep={prevStep}
            formData={formData}
            setFormData={setFormData}
            onSubmit={submitRegistration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="registro-flow">
      {loading && <div className="loading">Registrando...</div>}
      {error && <div className="error">Error: {error}</div>}
      {renderStep()}
    </div>
  );
};

export default RegistroFlow;