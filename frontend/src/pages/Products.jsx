// src/pages/Products.jsx
// Versión simplificada y corregida para el cliente, similar a la lógica del Dashboard.

import React, { useState, useEffect, useRef } from 'react';
import Hero from "../components/Products/Hero";
// Eliminadas las importaciones de componentes no utilizados
import Card from '../components/Products/Card';
import Footer from '../components/Footer';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import CategoriesCarousel from '../components/Products/CategoriesCarousel'; 
import Toast from '../components/ui/Toast';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// 🔑 El hook del cliente, se espera que filtre por país en el backend
import useProducts from '../hooks/Products/useProducts'; 

import './Products.css';

const Products = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { addToCart } = useCart();
  const [toast, setToast] = useState(false);
  const productsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  const { user, loading: authLoading } = useAuth();
  // 🔑 Usamos products, loading, error, y activeCountry del hook del cliente
  const { products, loading: productsLoading, error, refetch, activeCountry } = useProducts(); 

  // --- Lógica de Scroll y Resize ---
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // ---------------------------------

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      image: product.images?.[0] || '/placeholder.png',
      size: 'M',
      quantity: 1
    };
    
    addToCart(cartProduct);
    setCartOpen(true);
    setToast(true);

    const card = document.querySelector(`[data-product-id="${product._id}"]`);
    if (card) {
      card.style.transform = 'scale(1.05)';
      setTimeout(() => card.style.transform = 'scale(1)', 200);
    }
  };

  const handleCardHover = (productId) => setHoveredCard(productId);
  const handleCardLeave = () => setHoveredCard(null);

  const getParallaxStyle = (speed = 0.5) => ({
    transform: `translateY(${scrollY * speed}px)`,
    transition: 'transform 0.1s ease-out'
  });

  const handleCategoryClick = (category) => {
    // Aquí se podría implementar el filtrado por categoría si es necesario
    console.log('Categoría seleccionada:', category.name);
  };

  // 1. Manejo del estado de CARGA
  if (authLoading || productsLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFFFFF',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200px 100%',
          animation: 'shimmer 1.5s infinite'
        }}></div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          {authLoading ? 'Verificando acceso...' : `Cargando productos para ${activeCountry || 'tu región'}...`}
        </div>
      </div>
    );
  }

  // 2. Manejo de ERRORES
  // (Mantenemos la lógica de errores tal cual, ya que es la misma para el cliente)
  if (error) {
    return (
      <>
        <Nav cartOpen={cartOpen} />
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#FFFFFF',
          flexDirection: 'column',
          gap: '2rem',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e74c3c', marginBottom: '1rem' }}>
            Error al cargar productos
          </div>
          <div style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', maxWidth: '500px', lineHeight: '1.5' }}>
            {error.includes('autorizado') && !user
              ? "Para ver nuestros productos necesitas iniciar sesión en tu cuenta."
              : error}
          </div>
          <button 
            onClick={refetch}
            style={{
              padding: '12px 24px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#2980b9'}
            onMouseOut={(e) => e.target.style.background = '#3498db'}
          >
            Reintentar
          </button>
        </div>
        <Footer />
      </>
    );
  }
  // ---------------------------------

  // 3. Preparación de productos para la visualización

  // Aseguramos que 'products' sea un array para evitar errores si es null/undefined
  const displayProducts = Array.isArray(products) ? products : [];
  
  // 🔑 FILTRADO DE PROMOCIONES
  // 1. Filtrar solo los productos que tienen descuento (finalPrice < price o discountPercentage > 0)
  const discountedProducts = displayProducts.filter(product => 
    product.finalPrice < product.price || product.discountPercentage > 0
  );
  
  // 2. Tomar los primeros 3 productos con descuento para la sección de ofertas
  const promoProducts = discountedProducts.slice(0, 3);
  
  // 3. El resto de los productos, excluyendo los de la promoción para el grid.
  const promoIds = new Set(promoProducts.map(p => p._id));
  const gridProducts = displayProducts.filter(product => !promoIds.has(product._id));
  

  // 4. Renderizado principal
  return (
    <>
      <Toast message="¡Producto añadido al carrito!" show={toast} onClose={() => setToast(false)} />
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Barra de progreso de scroll */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #ffd6de, #b94a6c)',
        zIndex: 10000,
        transition: 'width 0.3s ease'
      }}></div>

      <Nav cartOpen={cartOpen} />
      <div style={getParallaxStyle(0.3)}>
        <Hero />
      </div>

      <div style={{
        opacity: scrollY > 300 ? 1 : 0.7,
        transform: `translateY(${Math.max(0, scrollY - 300) * 0.1}px)`,
        transition: 'all 0.3s ease'
      }}>
        <CategoriesCarousel onCategoryClick={handleCategoryClick} />
      </div>

      {/* Solo muestra este mensaje si NO está cargando y NO hay productos */}
      {displayProducts.length === 0 && !productsLoading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h2>No hay productos disponibles para {activeCountry || 'tu región'}</h2>
          <p>Vuelve pronto para ver nuestras novedades</p>
        </div>
      )}

      {/* RENDERIZADO CONDICIONAL: Solo muestra la sección si hay productos en promoción */}
      {promoProducts.length > 0 && (
        <div className="hero-product-content" style={{
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: isMobile ? 'center' : 'flex-start',
          marginTop: '2rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.5rem',
          width: '100%',
          opacity: scrollY > 400 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 400) * 0.1}px)`,
          transition: 'all 0.3s ease'
        }}>
          <h1 className="hero-product-title" style={{
            textAlign: 'left',
            width: 'auto',
            marginTop: '7rem',
            fontSize: '2.4rem',
            marginLeft: isMobile ? '2rem' : '10.5rem',
            animation: 'fadeInLeft 0.8s ease-out'
          }}>
            Disfruta las<br />mejores<br />promociones
          </h1>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: '2rem',
            marginTop: '3rem',
            marginLeft: isMobile ? 0 : '3rem'
          }}>
            {/* Iterar sobre promoProducts */}
            {promoProducts.map(product => (
              <div key={product._id} data-product-id={product._id} className="product-card-container"
                onMouseEnter={() => handleCardHover(product._id)}
                onMouseLeave={handleCardLeave}
                style={{ transform: hoveredCard === product._id ? 'scale(1.05) translateY(-10px)' : 'scale(1)' }}
              >
                <Card 
                  id={product._id}
                  title={product.name}
                  description={product.description}
                  image={product.images?.[0] || '/placeholder.png'}
                  oldPrice={product.discountPercentage > 0 ? `$${product.price}` : null}
                  price={`$${product.finalPrice || product.price}`}
                  discount={product.discountPercentage > 0 ? `${product.discountPercentage}%` : null}
                  imageHeight={185}
                  onAddToCart={() => handleAddToCart(product)}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {gridProducts.length > 0 && (
        <div ref={productsRef} className="products-container" style={{
          opacity: scrollY > 600 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 600) * 0.1}px)`
        }}>
          {Array.from({ length: Math.ceil(gridProducts.length / 4) }).map((_, rowIndex) => (
            <div key={rowIndex} className="products-row">
              {gridProducts.slice(rowIndex * 4, (rowIndex + 1) * 4).map(product => (
                <div key={product._id} data-product-id={product._id} className="product-card-container"
                  onMouseEnter={() => handleCardHover(product._id)}
                  onMouseLeave={handleCardLeave}
                  style={{ transform: hoveredCard === product._id ? 'scale(1.05) translateY(-10px)' : 'scale(1)' }}
                >
                  <Card 
                    id={product._id}
                    title={product.name}
                    description={product.description}
                    image={product.images?.[0] || '/placeholder.png'}
                    oldPrice={product.discountPercentage > 0 ? `$${product.price}` : null}
                    price={`$${product.finalPrice || product.price}`}
                    discount={product.discountPercentage > 0 ? `${product.discountPercentage}%` : null}
                    imageHeight={185}
                    onAddToCart={() => handleAddToCart(product)}
                    stock={product.stock}
                    measurements={product.measurements}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Products;