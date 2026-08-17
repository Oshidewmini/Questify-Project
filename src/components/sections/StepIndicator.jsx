import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${index + 1 <= currentStep ? 'active' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <span className="step-title">{step}</span>
          </div>
          {index < steps.length - 1 && <div className={`step-line ${index + 1 < currentStep ? 'active' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
