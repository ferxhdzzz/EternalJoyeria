import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products'; // Import centralized data
import '../styles/ProductDetail.css';
import Nav from '../components/Nav/Nav';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : '');

  if (!product) {
    return (
      <>
        <Nav />
        <div className="product-detail-page">
          <h2>Producto no encontrado</h2>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img, // Use 'img' from product data
      size: selectedSize,
      quantity: 1
    };
    addToCart(productToAdd);
    Swal.fire({
      title: '¡Añadido al carrito!',
      text: `${product.name} ahora está en tu carrito.`,
      icon: 'success',
      confirmButtonText: 'Genial',
      confirmButtonColor: '#D1A6B4',
      timer: 2500,
      timerProgressBar: true,
    });
  };

  return (
    <>
      <Nav />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-image-section">
            <img src={product.img} alt={product.name} className="main-product-image" />
            {/* Add logic for image gallery if there are multiple images */}
          </div>
          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="price-container">
              <span className="old-price">${product.oldPrice.toFixed(2)}</span>
              <span className="current-price">${product.price.toFixed(2)}</span>
            </div>
            <div className="size-selector">
              <p>Seleccionar tamaño</p>
              <div className="sizes">
                {product.sizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="description">
              <p><strong>Descripción</strong></p>
              <p>{product.description}</p>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
