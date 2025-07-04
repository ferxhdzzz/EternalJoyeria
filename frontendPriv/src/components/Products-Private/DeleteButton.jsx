import React from 'react';

const DeleteButton = ({ onClick }) => {
  return (
    <button className="btn-delete-private" onClick={onClick}>
      Eliminar
    </button>
  );
};

export default DeleteButton;
