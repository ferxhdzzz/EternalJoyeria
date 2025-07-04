import React, { useState } from 'react';
import UploadImage from './UploadImage';
import InputField from './InputField';
import TextArea from './TextArea';
import Button from './Button';
import './FormPage.css';

const FormPage = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});

  const validarTextoSinNumeros = (texto) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido.';
    } else if (!validarTextoSinNumeros(nombre)) {
      newErrors.nombre = 'El nombre no debe contener números.';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida.';
    } else if (!validarTextoSinNumeros(descripcion)) {
      newErrors.descripcion = 'La descripción no debe contener números.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Si no hay errores
      alert('Formulario válido. ¡Categoría agregada!');
      // Aquí podrías enviar los datos al backend
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form-containerr" onSubmit={handleSubmit}>
        <h2 className="form-titler">Agregar categoría</h2>

        <UploadImage />

        <InputField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={errors.nombre}
        />

        <TextArea
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          error={errors.descripcion}
        />

        <Button text="Agregar" type="submit" />
      </form>
    </div>
  );
};

export default FormPage;
