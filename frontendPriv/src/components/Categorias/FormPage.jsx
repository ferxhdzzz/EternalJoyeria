import React from 'react';
import UploadImage from './UploadImage';
import InputField from './InputField';
import TextArea from './TextArea';
import Button from './Button';
import './FormPage.css';

const FormPage = () => {
  return (
    <div className="form-wrapper">
      <div className="form-containerr">
        <h2 className="form-titler">Agregar categoría</h2>
   <UploadImage />
      <InputField label="Nombre"  />
      <TextArea label="Descripción"/>
      <Button text="Agregar" />

      </div>
    </div>
  );
};

export default FormPage;
