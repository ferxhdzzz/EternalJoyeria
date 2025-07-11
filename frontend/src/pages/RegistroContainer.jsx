import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Register/Stepper';
import Registro from './Registro'; // Step 1
import Registro2 from './Registro2'; // Step 2
import EmailVerification from '../components/Register/EmailVerification'; // Step 3
import ProfilePhotoUpload from '../components/Register/ProfilePhotoUpload'; // Step 4
import BackArrow from '../components/registro/backarrow/BackArrow';
import '../styles/AuthStyles.css'; // Reutilizando los estilos de autenticación
import '../styles/RegistroContainer.css';

const RegistroContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    user: "",
    email: "",
    phone: "",
    password: "",
    country: "sv",
    profilePhoto: null,
  });
  const navigate = useNavigate();

  const nextStep = () => setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : navigate("/")));

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
    } else {
      navigate("/");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Registro nextStep={nextStep} formData={formData} setFormData={setFormData} />;
      case 2:
        return <Registro2 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
      case 3:
        return <EmailVerification nextStep={nextStep} prevStep={prevStep} email={formData.email} />;
      case 4:
        return <ProfilePhotoUpload prevStep={prevStep} formData={formData} setFormData={setFormData} />;
      default:
        return <Registro nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    }
  };

  return (
    <div
      className="recover-wrapper"
      style={{
        backgroundImage: `url("/Registro/loginneternal.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="recover-card">
        <BackArrow onClick={handleBack} />
        <Stepper currentStep={currentStep} />
        <div className="registro-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default RegistroContainer;
