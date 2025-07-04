import React from 'react';

const EditButton = ({ onClick }) => {
  return (
    <button className="btn-edit-private" onClick={onClick}>
      Editar
    </button>
  );
};

export default EditButton;
