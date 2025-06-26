import React, { useState } from 'react';
import QuantityCounter from './QuantityCounter';
import ImageUploader from './ImageUploader';
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
        <label>Nombre del producto</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
      </div>

      <div className="right-form">
        <div className="price-discount">
          <div>
            <label>Precio</label>
            <input type="text" name="precio" value={formData.precio} onChange={handleChange} />
          </div>
          <div>
            <label>Descuento</label>
            <input type="text" name="descuento" value={formData.descuento} onChange={handleChange} />
          </div>
        </div>

        <label className="cantidad-label">Cantidad</label>
        <QuantityCounter />

        <div className="medidas">
          <label>Largo</label>
          <input type="text" name="largo" value={formData.largo} onChange={handleChange} />
          <label>Ancho</label>
          <input type="text" name="ancho" value={formData.ancho} onChange={handleChange} />
          <label>Peso (g)</label>
          <input type="text" name="peso" value={formData.peso} onChange={handleChange} />
        </div>

        <ImageUploader />
      </div>
    </div>
  );
};

export default ProductForm;
