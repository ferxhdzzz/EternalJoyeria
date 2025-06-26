import React from 'react';
import './Stepper.css';

const Stepper = ({ currentStep }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="stepper-wrapper">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`step ${currentStep >= step ? 'active' : ''}`}>
            {currentStep > step ? '✔' : step}
          </div>
          {index < steps.length - 1 && <div className={`step-connector ${currentStep > step + 1 ? 'active' : ''}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
