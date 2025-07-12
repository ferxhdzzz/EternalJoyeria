import React from 'react';
import { useNavigate } from 'react-router-dom';
import Registro from './Registro'; // Componente unificado
import '../styles/AuthStyles.css';
import '../styles/RegistroContainer.css';

const RegistroContainer = () => {
  const navigate = useNavigate();

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
        <div className="registro-content">
          <Registro />
        </div>
      </div>
    </div>
  );
};

export default RegistroContainer;