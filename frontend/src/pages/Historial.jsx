import React, { useState } from 'react';
import Nav from '../components/Nav/Nav';
import HistorialItem from '../components/Historial/HistorialItem';
import SidebarCart from '../components/Cart/SidebarCart';
import './Historial.css';
import Footer from '../components/Footer';

const initialProducts = [
  {
    id: 1,
    name: 'Collar con corazón',
    price: 120,
    image: '/Products/product1.png',
    quantity: 1,
    date: '2024-01-15',
    status: 'Entregado',
    orderNumber: '#ET-2024-001'
  },
  {
    id: 2,
    name: 'Pulsera flor',
    price: 250,
    image: '/Products/product3.png',
    quantity: 1,
    date: '2024-01-10',
    status: 'En camino',
    orderNumber: '#ET-2024-002'
  },
  {
    id: 3,
    name: 'Collar con corazón',
    price: 110,
    image: '/Products/product1.png',
    quantity: 1,
    date: '2024-01-05',
    status: 'Entregado',
    orderNumber: '#ET-2024-003'
  },
  {
    id: 4,
    name: 'Pulsera flor',
    price: 110,
    image: '/Products/categoria3.png',
    quantity: 1,
    date: '2023-12-28',
    status: 'Entregado',
    orderNumber: '#ET-2023-004'
  },
  {
    id: 5,
    name: 'Collar mini dije',
    price: 110,
    image: '/Products/product3.png',
    quantity: 1,
    date: '2023-12-20',
    status: 'Entregado',
    orderNumber: '#ET-2023-005'
  },
  {
    id: 6,
    name: 'Collar mini dije',
    price: 110,
    image: '/Products/categoria3.png',
    quantity: 1,
    date: '2023-12-15',
    status: 'Entregado',
    orderNumber: '#ET-2023-006'
  },
];

const HistorialPage = () => {
  const [products] = useState(initialProducts);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const filteredProducts = selectedFilter === 'todos' 
    ? products 
    : products.filter(product => product.status.toLowerCase().includes(selectedFilter));

  const totalSpent = products.reduce((total, product) => total + (product.price * product.quantity), 0);
  const totalOrders = products.length;

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      
      <div className="historial-page">
        {/* Hero Section */}
        <div className="historial-hero">
          <div className="historial-hero-content">
            <div className="historial-hero-text">
              <h1 className="historial-title">Tu Historial de Compras</h1>
              <p className="historial-subtitle">Revive tus momentos especiales con nuestras joyas únicas</p>
            </div>
            <div className="historial-stats">
              <div className="stat-card">
                <div className="stat-number">{totalOrders}</div>
                <div className="stat-label">Pedidos Realizados</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">${totalSpent.toFixed(2)}</div>
                <div className="stat-label">Total Invertido</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="historial-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('todos')}
            >
              Todos los pedidos
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'entregado' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('entregado')}
            >
              Entregados
            </button>
            <button 
              className={`filter-btn ${selectedFilter === 'camino' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('camino')}
            >
              En camino
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="historial-orders">
          <div className="orders-container">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No hay pedidos para mostrar</h3>
                <p>Cuando realices tu primera compra, aparecerá aquí</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <HistorialItem
                  key={product.id}
                  product={product}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default HistorialPage;

