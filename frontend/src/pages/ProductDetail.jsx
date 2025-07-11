import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products'; // Import centralized data
import '../styles/ProductDetail.css';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);
  const [cartOpen, setCartOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
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
      quantity: quantity
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
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 32, height: 28, borderRadius: 14, background: '#f5f5f5', border: 'none', fontSize: 15, fontWeight: 700, color: '#888', cursor: 'pointer', transition: 'background 0.2s' }}>-</button>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#23233a', minWidth: 18, textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} style={{ width: 32, height: 28, borderRadius: 14, background: '#f5f5f5', border: 'none', fontSize: 15, fontWeight: 700, color: '#888', cursor: 'pointer', transition: 'background 0.2s' }}>+</button>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: 24 }}>
              <button onClick={handleAddToCart} style={{ background: 'red', color: 'white', fontWeight: 900, border: 'none', borderRadius: 8, padding: '18px 44px', fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px #ffd6de33', transition: 'background 0.18s, color 0.18s', letterSpacing: '1px' }}>AÑADIR AL CARRITO (PRUEBA)</button>
            </div>
            <div className="description">
              <p><strong>Descripción</strong></p>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
