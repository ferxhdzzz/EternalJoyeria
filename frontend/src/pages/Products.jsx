// Importaciones necesarias para la página de productos
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
import CategoriesCarousel from '../components/Products/CategoriesCarousel'; // Nuevo import
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Importar contexto de auth
import Toast from '../components/ui/Toast';
import useProducts from '../hooks/Products/useProducts'; // Hook personalizado para productos
import './Products.css';

const Products = () => {
  // Estados para controlar el comportamiento de la página
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();
  const [toast, setToast] = useState(false);
  const productsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  // Contexto de autenticación
  const { user, loading: authLoading } = useAuth();

  // Hook personalizado para obtener productos de la API
  const { products, loading: productsLoading, error, refetch } = useProducts();

  // Combinar loading de auth y productos
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Solo terminar el loading cuando ambos (auth y products) hayan terminado
    if (!authLoading && !productsLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Tiempo mínimo de loading para mejor UX
      return () => clearTimeout(timer);
    }
  }, [authLoading, productsLoading]);

  // Efecto: Listener para eventos de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto: Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para añadir productos al carrito
  const handleAddToCart = (product) => {
    // Adaptar el producto de la API al formato esperado por el carrito
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      image: product.images && product.images[0] ? product.images[0] : '/placeholder.png',
      size: 'M',
      quantity: 1
    };
    
    addToCart(cartProduct);
    setCartOpen(true);
    setToast(true);
    
    // Efecto visual de éxito en la tarjeta
    const card = document.querySelector(`[data-product-id="${product._id}"]`);
    if (card) {
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const handleCardHover = (productId) => {
    setHoveredCard(productId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const getParallaxStyle = (speed = 0.5) => ({
    transform: `translateY(${scrollY * speed}px)`,
    transition: 'transform 0.1s ease-out'
  });

  // Función para manejar click en categoría
  const handleCategoryClick = (category) => {
    console.log('Categoría seleccionada:', category.name);
    // Aquí puedes implementar la lógica para filtrar productos por categoría
    // Por ejemplo: filtrar productos o navegar a una página específica
    // setFilteredProducts(products.filter(product => product.categoryId === category._id));
    // O navegar: window.location.href = `/products?category=${category._id}`;
  };

  // Renderizado del estado de carga
  if (isLoading || authLoading) {
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
          {authLoading ? 'Verificando acceso...' : 'Cargando productos...'}
        </div>
      </div>
    );
  }

  // Manejo de errores de autenticación
  if (error && error.includes('autorizado') && !user) {
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
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            🔒
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '1rem'
          }}>
            Acceso Requerido
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            Para ver nuestros productos necesitas iniciar sesión en tu cuenta.
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '12px 24px',
                background: '#D1A6B4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#b8939e'}
              onMouseOut={(e) => e.target.style.background = '#D1A6B4'}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => window.location.href = '/register'}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#D1A6B4',
                border: '2px solid #D1A6B4',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#D1A6B4';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#D1A6B4';
              }}
            >
              Crear Cuenta
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Manejo de otros errores de la API
  if (error && !error.includes('autorizado')) {
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
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ⚠️
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#e74c3c',
            marginBottom: '1rem'
          }}>
            Error al cargar productos
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            maxWidth: '500px',
            lineHeight: '1.5'
          }}>
            {error}
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

  // Obtener productos para mostrar
  const displayProducts = products || [];
  const featuredProducts = displayProducts.slice(0, 3);
  const gridProducts = displayProducts.slice(3);

  return (
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

      <Nav cartOpen={cartOpen} />
      
      <div style={getParallaxStyle(0.3)}>
        <Hero />
      </div>
      
      
      
      {/* Carrusel de Categorías */}
      <div style={{
        opacity: scrollY > 300 ? 1 : 0.7,
        transform: `translateY(${Math.max(0, scrollY - 300) * 0.1}px)`,
        transition: 'all 0.3s ease'
      }}>
        <CategoriesCarousel onCategoryClick={handleCategoryClick} />
      </div>
      
      {/* Mensaje si no hay productos */}
      {displayProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#666'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h2>No hay productos disponibles</h2>
          <p>Vuelve pronto para ver nuestras novedades</p>
        </div>
      )}
      
      {/* Sección de productos destacados */}
      {featuredProducts.length > 0 && (
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
            {featuredProducts.map((product) => (
              <div 
                key={product._id}
                data-product-id={product._id}
                className="product-card-container"
                onMouseEnter={() => handleCardHover(product._id)}
                onMouseLeave={handleCardLeave}
                style={{
                  transform: hoveredCard === product._id ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
                }}
              >
                <Card 
                  id={product._id}
                  title={product.name}
                  description={product.description}
                  image={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
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
      
      {/* Grilla de productos restantes */}
      {gridProducts.length > 0 && (
        <div 
          ref={productsRef}
          className="products-container"
          style={{ 
            opacity: scrollY > 600 ? 1 : 0.7,
            transform: `translateY(${Math.max(0, scrollY - 600) * 0.1}px)`
          }}
        >
          {/* Organizar productos en filas de 4 */}
          {Array.from({ length: Math.ceil(gridProducts.length / 4) }).map((_, rowIndex) => (
            <div key={rowIndex} className="products-row">
              {gridProducts.slice(rowIndex * 4, (rowIndex + 1) * 4).map((product) => (
                <div 
                  key={product._id}
                  data-product-id={product._id}
                  className="product-card-container"
                  onMouseEnter={() => handleCardHover(product._id)}
                  onMouseLeave={handleCardLeave}
                  style={{
                    transform: hoveredCard === product._id ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
                  }}
                >
                  <Card 
                    id={product._id}
                    title={product.name}
                    description={product.description}
                    image={product.images && product.images[0] ? product.images[0] : '/placeholder.png'}
                    oldPrice={product.discountPercentage > 0 ? `$${product.price}` : null}
                    price={`$${product.finalPrice || product.price}`}
                    discount={product.discountPercentage > 0 ? `${product.discountPercentage}%` : null}
                    imageHeight={185}
                    style={{ width: '250px', height: '350px' }}
                    simplePrice={true}
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