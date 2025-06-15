// src/pages/CartPage/CartPage.jsx
import React, { useState } from 'react';
import Hitorial from '../components/Carrito/Historial/Historial';
import Nav from '../components/Nav/Nav';
import '../styles/CartPage.css';

const initialProducts = [
  {
    id: 1,
    name: 'Collar con corazón',
    price: 120,
    image: 'http://localhost:5173/Products/product1.png',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Pulsera flor',
    price: 250,
    image: 'http://localhost:5173/Products/product3.png',
    quantity: 1,
  },
  {
    id: 3,
    name: 'Collar con corazón',
    price: 110,
    image: 'http://localhost:5173/Products/product1.png',
    quantity: 1,
  },
  {
    id: 4,
    name: 'Pulsera flor',
    price: 110,
    image: 'http://localhost:5173/Products/categoria3.png',
    quantity: 1,
  },
  {
    id: 5,
    name: 'Collar mini dije',
    price: 110,
    image: 'http://localhost:5173/Products/product3.png',
    quantity: 1,
  },
  {
    id: 6,
    name: 'Collar mini dije',
    price: 110,
    image: 'http://localhost:5173/Products/categoria3.png',
    quantity: 1,
  },
];

const CartPage = () => {
  const [products, setProducts] = useState(initialProducts);

  const updateQuantity = (id, newQty) => {
    const updated = products.map(p => p.id === id ? { ...p, quantity: newQty } : p);
    setProducts(updated);
  };

  const total = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleBuy = () => {
    alert('Compra realizada con éxito.');
  };

  return (

<>
<Nav/>
  <div className="cart-page">
      <div className="cart-container">
        <h2>Tus compras realizadas</h2>
        {products.map(product => (
          <Hitorial
            key={product.id}
            product={product}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      
      </div>
    </div>
</>

  
  );
};

export default CartPage;

