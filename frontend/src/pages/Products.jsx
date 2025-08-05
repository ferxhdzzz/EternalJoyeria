import React, { useState, useEffect, useRef } from 'react';
import Hero from "../components/Products/Hero";
import ProductShowcase from '../components/Products/ProductShowcase';
import Categories from '../components/Products/Categories';
import ProductGrid from '../components/Products/ProductGrid';
import CardsRow from '../components/Products/CardsRow';
import Card from '../components/Products/Card';
import Footer from '../components/Footer';
import RatingBox from '../components/Products/RatingBox';
import Nav from '../components/Nav/Nav';
import SidebarCart from '../components/Cart/SidebarCart';
import { useCart } from '../context/CartContext';
import Toast from '../components/ui/Toast';
import './Products.css';

// Defines the Products page component.
const Products = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();
  const [toast, setToast] = useState(false);
  const productsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para añadir al carrito y abrir el panel
  const handleAddToCart = (product) => {
    addToCart(product);
    setCartOpen(true);
    setToast(true);
    
    // Efecto de éxito
    const card = document.querySelector(`[data-product-id="${product.id}"]`);
    if (card) {
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 200);
    }
  };

  // Función para manejar hover en las cards
  const handleCardHover = (productId) => {
    setHoveredCard(productId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  // Efecto de parallax para elementos
  const getParallaxStyle = (speed = 0.5) => ({
    transform: `translateY(${scrollY * speed}px)`,
    transition: 'transform 0.1s ease-out'
  });

  if (isLoading) {
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
          Cargando productos...
        </div>
      </div>
    );
  }

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // React Fragment (<>) is used to group multiple elements without adding an extra node to the DOM.
    <>
      <Toast message="¡Producto añadido al carrito!" show={toast} onClose={() => setToast(false)} />
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Indicador de progreso de scroll */}
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

      {/* Renders the navigation bar at the top of the page. */}
      <Nav cartOpen={cartOpen} />
      
      {/* Renders the hero section specific to the Products page. */}
      <div style={getParallaxStyle(0.3)}>
        <Hero />
      </div>
      
      <div style={{
        opacity: scrollY > 200 ? 1 : 0.7,
        transform: `translateY(${Math.max(0, scrollY - 200) * 0.1}px)`,
        transition: 'all 0.3s ease'
      }}>
        <CardsRow />
      </div>
      
      <div
        className="hero-product-content"
        style={{
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
        }}
      >
        <h1
          className="hero-product-title"
          style={{
            textAlign: 'left',
            width: 'auto',
            marginTop: '7rem',
            fontSize: '2.4rem',
            marginLeft: isMobile ? '2rem' : '10.5rem',
            animation: 'fadeInLeft 0.8s ease-out'
          }}
        >
          Disfruta las<br />mejores<br />promociones
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: '2rem',
            marginTop: '3rem',
            marginLeft: isMobile ? 0 : '3rem'
          }}
        >
          <div 
            data-product-id="promo-1"
            onMouseEnter={() => handleCardHover('promo-1')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-1' ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
              transition: 'all 0.3s ease',
              zIndex: 99999
            }}
          >
            <Card imageHeight={185} onAddToCart={handleAddToCart} />
          </div>
          <div 
            data-product-id="promo-2"
            onMouseEnter={() => handleCardHover('promo-2')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-2' ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
              transition: 'all 0.3s ease',
              zIndex: 99999
            }}
          >
            <Card 
              title="collar de orquidea morada"
              description="Un collar elegante con orquídea morada, ideal para cualquier ocasión."
              image="/Products/CollarMoradoEternal.png"
              oldPrice="$59.99"
              price="$39.99"
              imageHeight={185}
              onAddToCart={handleAddToCart}
            />
          </div>
          <div 
            data-product-id="promo-3"
            onMouseEnter={() => handleCardHover('promo-3')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-3' ? 'scale(1.05) translateY(-10px)' : 'scale(1)',
              transition: 'all 0.3s ease',
              zIndex: 99999
            }}
          >
            <Card 
              title="Collar de orquidea rosa"
              description="Un collar elegante con orquídea rosa, ideal para ocasiones especiales."
              image="/Products/CollarEternal.png"
              oldPrice="$59.99"
              price="$39.99"
              imageHeight={185}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
      
      {/* 8 nuevas cards en dos filas de 4, al final */}
      <div 
        ref={productsRef}
        className="products-container"
        style={{ 
          opacity: scrollY > 600 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 600) * 0.1}px)`
        }}
      >
        <div className="products-row">
          {[
            { id: "anillo-orquidea", title: "Anillo de Orquídea", description: "Anillo artesanal con orquídea natural preservada en resina. Pieza única y elegante.", image: "/Products/AnilloOrchid.png" },
            { id: "collar-orquidea", title: "Collar de Orquídea", description: "Collar delicado con orquídea encapsulada, ideal para ocasiones especiales.", image: "/Products/CollarOrchid.png" },
            { id: "peineta-orquidea", title: "Peineta para el Pelo", description: "Peineta decorativa con orquídea natural, perfecta para peinados elegantes.", image: "/Products/PeinetaOrchid.png" },
            { id: "aretes-orquidea", title: "Aretes de Orquídea", description: "Aretes ligeros y sofisticados con orquídea natural en resina.", image: "/Products/AretesOrchid.png" }
          ].map((product, index) => (
            <div 
              key={product.id}
              data-product-id={product.id}
              className="product-card-container"
              onMouseEnter={() => handleCardHover(product.id)}
              onMouseLeave={handleCardLeave}
              style={{
                transform: hoveredCard === product.id ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
              }}
            >
              <Card 
                id={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
                imageHeight={185}
                style={{ width: '250px', height: '350px' }}
                simplePrice={true}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
        <div className="products-row">
          {[
            { id: "1", title: "Collar con corazón", description: "Un delicado collar que captura la esencia del amor y la elegancia, perfecto para cualquier ocasión.", image: "/Products/product1.png" },
            { id: "2", title: "Pulsera flor", description: "Esta pulsera floral añade un toque de naturaleza y feminidad a tu estilo, hecha a mano con detalles exquisitos.", image: "/Products/product2.png" },
            { id: "3", title: "Anillo pastel", description: "Un anillo encantador en tonos pastel, ideal para complementar un look suave y sofisticado.", image: "/Products/product3.png" },
            { id: "4", title: "Collar mini dije", description: "Sutil y elegante, este collar con un mini dije es la pieza perfecta para el uso diario.", image: "/Products/product4.png" }
          ].map((product, index) => (
            <div 
              key={product.id}
              data-product-id={product.id}
              className="product-card-container"
              onMouseEnter={() => handleCardHover(product.id)}
              onMouseLeave={handleCardLeave}
              style={{
                transform: hoveredCard === product.id ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
              }}
            >
              <Card 
                id={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
                imageHeight={185}
                style={{ width: '250px', height: '350px' }}
                simplePrice={true}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Exports the Products component to be used in the application's routing setup.
export default Products;
