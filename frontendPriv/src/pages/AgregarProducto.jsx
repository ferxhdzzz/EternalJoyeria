import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import TopBar from '../components/TopBar/TopBar';
import CategorySelector from '../components/AddProducts/CategorySelector';
import ProductForm from '../components/AddProducts/ProductForm';
import '../styles/AddProducts/AgregarProducto.css';

const AgregarProducto = () => {
  return (
    <div className="agregar-producto-layout">
      <Sidebar />
      <div className="agregar-producto-content">
        <TopBar />
        <div className="agregar-producto-page">
          <CategorySelector />
          <h2 className="add-title">Agregar Producto</h2>
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default AgregarProducto;
