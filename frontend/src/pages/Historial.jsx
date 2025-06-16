import React, { useState } from 'react';
import Nav from '../components/Nav/Nav';
import HistorialItem from '../components/Historial/HistorialItem';
import '../components/Cart/CartPage.css'; // Re-using cart styles for now
import Footer from '../components/Footer';

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

const HistorialPage = () => {
  const [products] = useState(initialProducts);

  return (
    <>
      <Nav />
      <div className="cart-page">
        <div className="cart-container">
          <h2>Tus compras realizadas</h2>
          {products.map(product => (
            <HistorialItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>

  
  );
};

export default HistorialPage;

