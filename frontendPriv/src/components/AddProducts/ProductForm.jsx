import React, { useState } from 'react';
import QuantityCounter from './QuantityCounter';
import ImageUploader from './ImageUploader';
import FormLabel from './FormLabel';
import FormInput from './FormInput';
import Guardar from './GuardarButton';
import '../../styles/AddProducts/ProductForm.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    descuento: '',
    largo: '',
    ancho: '',
    peso: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Este campo es requerido';
    } else if (/\d/.test(formData.nombre)) {
      newErrors.nombre = 'No puede contener números';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Este campo es requerido';
    } else if (/\d/.test(formData.descripcion)) {
      newErrors.descripcion = 'No puede contener números';
    }

    const numberPattern = /^[0-9]*\.?[0-9]+$/;

    if (!formData.precio.trim()) {
      newErrors.precio = 'Este campo es requerido';
    } else if (!numberPattern.test(formData.precio)) {
      newErrors.precio = 'Solo se permiten números y punto decimal';
    }

    if (formData.descuento && !numberPattern.test(formData.descuento)) {
      newErrors.descuento = 'Solo se permiten números y punto decimal';
    }

    ['largo', 'ancho', 'peso'].forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'Este campo es requerido';
      } else if (!numberPattern.test(formData[field])) {
        newErrors[field] = 'Solo se permiten números y punto decimal';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('Formulario válido, puedes enviarlo');
      // Aquí va la lógica de envío si quieres
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form">
        <div className="left-form">
          <FormLabel htmlFor="nombre">Nombre del producto</FormLabel>
          <FormInput name="nombre" value={formData.nombre} onChange={handleChange} />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}

          <FormLabel htmlFor="descripcion">Descripción</FormLabel>
          <FormInput name="descripcion" value={formData.descripcion} onChange={handleChange} isTextarea />
          {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}

          <div className="medidas">
            <div>
              <FormLabel htmlFor="largo">Largo (cm)</FormLabel>
              <FormInput name="largo" value={formData.largo} onChange={handleChange} />
              {errors.largo && <span className="error-message">{errors.largo}</span>}
            </div>
            <div>
              <FormLabel htmlFor="ancho">Ancho (cm)</FormLabel>
              <FormInput name="ancho" value={formData.ancho} onChange={handleChange} />
              {errors.ancho && <span className="error-message">{errors.ancho}</span>}
            </div>
            <div>
              <FormLabel htmlFor="peso">Peso (g)</FormLabel>
              <FormInput name="peso" value={formData.peso} onChange={handleChange} />
              {errors.peso && <span className="error-message">{errors.peso}</span>}
            </div>
          </div>
        </div>

        <div className="right-form">
          <ImageUploader />

          <div className="price-discount">
            <div>
              <FormLabel htmlFor="precio">Precio</FormLabel>
              <FormInput name="precio" value={formData.precio} onChange={handleChange} />
              {errors.precio && <span className="error-message">{errors.precio}</span>}
            </div>
            <div>
              <FormLabel htmlFor="descuento">Descuento</FormLabel>
              <FormInput name="descuento" value={formData.descuento} onChange={handleChange} />
              {errors.descuento && <span className="error-message">{errors.descuento}</span>}
            </div>
          </div>

          <FormLabel htmlFor="cantidad">Cantidad</FormLabel>
          <QuantityCounter />
        </div>
      </div>
      <Guardar onClick={handleSubmit} />
    </div>
  );
};

export default ProductForm;
