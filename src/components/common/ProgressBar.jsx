import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, label, target, color }) => {
  return (
    <div className="progress-container">
      {(label || target) && (
        <div className="progress-labels">
          {label && <span className="progress-title">{label}</span>}
          {target && <span className="progress-target">Target: {target}</span>}
        </div>
      )}
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${progress}%`,
            backgroundColor: color || 'var(--color-primary-dark)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
