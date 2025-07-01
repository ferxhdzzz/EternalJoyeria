import React, { useState } from 'react';
import QuantityCounter from './QuantityCounter';
import ImageUploader from './ImageUploader';
import FormLabel from './FormLabel';
import FormInput from './FormInput';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="product-form">
      <div className="left-form">
        <FormLabel htmlFor="nombre">Nombre del producto</FormLabel>
        <FormInput name="nombre" value={formData.nombre} onChange={handleChange} />

        <FormLabel htmlFor="descripcion">Descripción</FormLabel>
        <FormInput name="descripcion" value={formData.descripcion} onChange={handleChange} isTextarea />
      </div>

      <div className="right-form">
        <div className="price-discount">
          <div>
            <FormLabel htmlFor="precio">Precio</FormLabel>
            <FormInput name="precio" value={formData.precio} onChange={handleChange} />
          </div>
          <div>
            <FormLabel htmlFor="descuento">Descuento</FormLabel>
            <FormInput name="descuento" value={formData.descuento} onChange={handleChange} />
          </div>
        </div>

        <FormLabel htmlFor="cantidad" className="cantidad-label">Cantidad</FormLabel>
        <QuantityCounter />

        <div className="medidas">
          <FormLabel htmlFor="largo">Largo</FormLabel>
          <FormInput name="largo" value={formData.largo} onChange={handleChange} />

          <FormLabel htmlFor="ancho">Ancho</FormLabel>
          <FormInput name="ancho" value={formData.ancho} onChange={handleChange} />

          <FormLabel htmlFor="peso">Peso (g)</FormLabel>
          <FormInput name="peso" value={formData.peso} onChange={handleChange} />
        </div>

        <ImageUploader />
      </div>
    </div>
  );
};

export default ProductForm;