import React, { useState } from "react";
import Registro from "../../pages/Registro";
import Registro2 from "../../pages/Registro2";
import Registro3 from "../../pages/Registro3";

const RegistroForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos del paso 1
    name: "",
    lastName: "",
    
    // Datos del paso 2
    email: "",
    phone: "",
    contra: "",
    country: "sv",
    
    // Datos del paso 3
    img: ""
  });

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

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
          <Registro3
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="registro-container">
      {renderStep()}
      
      {/* Debug: Mostrar datos actuales (opcional) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <h4>Datos actuales:</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RegistroForm;