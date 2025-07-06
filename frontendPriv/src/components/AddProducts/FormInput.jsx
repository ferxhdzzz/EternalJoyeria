import React from 'react';

const FormInput = ({ type = 'text', name, value, onChange, isTextarea = false }) => {
  return isTextarea ? (
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    />
  ) : (
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormInput;