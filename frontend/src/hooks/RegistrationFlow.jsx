
// Componente principal que maneja el flujo
import React, { useState } from "react";
import useRegistration from "../hooks/useRegistration.jsx";
import Registro from "../pages/Registro.jsx";
import Registro2 from "../pages/Registro2.jsx";
import RegistroPaso2 from "../hooks/RegistroPaso2.jsx";

const RegistrationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const registration = useRegistration();

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Registro nextStep={nextStep} registration={registration} />;
      case 2:
        return <Registro2 nextStep={nextStep} prevStep={prevStep} registration={registration} />;
      case 3:
        return <RegistroPaso2 prevStep={prevStep} registration={registration} />;
      default:
        return <Registro nextStep={nextStep} registration={registration} />;
    }
  };

  return (
    <div className="recover-wrapper">
      <div className="recover-card">
        {renderStep()}
      </div>
    </div>
  );
};

export default RegistrationFlow;