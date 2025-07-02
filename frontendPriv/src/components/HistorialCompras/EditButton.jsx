import React from 'react';
import './EditButton.css';

const EditButton = ({ onClick }) => {
  return (
    <button className="editar-button2" onClick={onClick}>
      Editar
    </button>
  );
};

export default EditButton;
