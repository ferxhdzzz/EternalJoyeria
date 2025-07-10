import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2200);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`toast-pastel ${show ? 'show' : ''}`}>{message}</div>
  );
};

export default Toast; 