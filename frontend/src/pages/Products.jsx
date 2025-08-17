// Importaciones necesarias para la página de productos
import React, { useState, useEffect, useRef } from 'react'; // React y hooks para estado, efectos y referencias
import Hero from "../components/Products/Hero"; // Componente hero de la página de productos
import ProductShowcase from '../components/Products/ProductShowcase'; // Componente de exhibición de productos
import Categories from '../components/Products/Categories'; // Componente de categorías
import ProductGrid from '../components/Products/ProductGrid'; // Componente de grilla de productos
import CardsRow from '../components/Products/CardsRow'; // Componente de fila de tarjetas
import Card from '../components/Products/Card'; // Componente de tarjeta individual
import Footer from '../components/Footer'; // Componente del pie de página
import RatingBox from '../components/Products/RatingBox'; // Componente de caja de calificación
import Nav from '../components/Nav/Nav'; // Componente de navegación
import SidebarCart from '../components/Cart/SidebarCart'; // Componente del carrito lateral
import { useCart } from '../context/CartContext'; // Hook del contexto del carrito
import Toast from '../components/ui/Toast'; // Componente de notificación toast
import './Products.css'; // Estilos CSS específicos de la página de productos

// Define el componente de la página de productos
const Products = () => {
  // Estados para controlar el comportamiento de la página
  const [cartOpen, setCartOpen] = useState(false); // Estado del carrito lateral (abierto/cerrado)
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
  const [scrollY, setScrollY] = useState(0); // Posición actual del scroll
  const [hoveredCard, setHoveredCard] = useState(null); // ID de la tarjeta sobre la que está el hover
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados (no usado actualmente)
  const { addToCart } = useCart(); // Función para agregar al carrito desde el contexto
  const [toast, setToast] = useState(false); // Estado de la notificación toast
  const productsRef = useRef(null); // Referencia al contenedor de productos
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700); // Estado para detectar dispositivos móviles

  // Efecto: Simular carga inicial de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Finalizar estado de carga después de 1 segundo
    }, 1000);
    return () => clearTimeout(timer); // Limpiar timer al desmontar
  }, []);

  // Efecto: Listener para eventos de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Actualizar posición del scroll
    };

    window.addEventListener('scroll', handleScroll); // Agregar listener
    return () => window.removeEventListener('scroll', handleScroll); // Limpiar listener
  }, []);

  // Efecto: Detectar cambios de tamaño de pantalla para responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700); // Actualizar estado móvil
    };
    window.addEventListener('resize', handleResize); // Agregar listener
    return () => window.removeEventListener('resize', handleResize); // Limpiar listener
  }, []);

  // Función para añadir productos al carrito y abrir el panel lateral
  const handleAddToCart = (product) => {
    addToCart(product); // Agregar producto al carrito
    setCartOpen(true); // Abrir carrito lateral
    setToast(true); // Mostrar notificación toast
    
    // Efecto visual de éxito en la tarjeta
    const card = document.querySelector(`[data-product-id="${product.id}"]`);
    if (card) {
      card.style.transform = 'scale(1.05)'; // Escalar la tarjeta
      setTimeout(() => {
        card.style.transform = 'scale(1)'; // Volver al tamaño normal
      }, 200); // Después de 200ms
    }
  };

  // Función para manejar el hover sobre las tarjetas de productos
  const handleCardHover = (productId) => {
    setHoveredCard(productId); // Establecer ID de la tarjeta con hover
  };

  // Función para manejar cuando el mouse sale de una tarjeta
  const handleCardLeave = () => {
    setHoveredCard(null); // Limpiar ID de tarjeta con hover
  };

  // Función para crear efecto de parallax en elementos
  const getParallaxStyle = (speed = 0.5) => ({
    transform: `translateY(${scrollY * speed}px)`, // Mover elemento basado en scroll
    transition: 'transform 0.1s ease-out' // Transición suave
  });

  // Renderizado del estado de carga inicial
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', // Altura mínima de toda la pantalla
        display: 'flex',
        justifyContent: 'center', // Centrar horizontalmente
        alignItems: 'center', // Centrar verticalmente
        background: '#FFFFFF', // Fondo blanco
        flexDirection: 'column', // Dirección de columna
        gap: '2rem' // Espacio entre elementos
      }}>
        {/* Spinner de carga animado */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%', // Forma circular
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', // Gradiente
          backgroundSize: '200px 100%',
          animation: 'shimmer 1.5s infinite' // Animación de brillo
        }}></div>
        {/* Texto de carga */}
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#333',
          animation: 'fadeInUp 0.8s ease-out' // Animación de aparición
        }}>
          Cargando productos...
        </div>
      </div>
    );
  }

  // El return contiene el JSX que se renderizará en el DOM
  return (
    // Fragmento de React (<>) se usa para agrupar múltiples elementos sin agregar un nodo extra al DOM
    <>
      <Toast message="¡Producto añadido al carrito!" show={toast} onClose={() => setToast(false)} /> {/* Notificación toast */}
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} /> {/* Carrito lateral */}
      
      {/* Indicador de progreso de scroll - Barra superior que muestra el progreso */}
      <div style={{
        position: 'fixed', // Posición fija en la parte superior
        top: 0,
        left: 0,
        width: `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`, // Ancho basado en progreso
        height: '3px', // Altura de la barra
        background: 'linear-gradient(90deg, #ffd6de, #b94a6c)', // Gradiente rosa
        zIndex: 10000, // Z-index alto para estar por encima de todo
        transition: 'width 0.3s ease' // Transición suave
      }}></div>

      {/* Renderiza la barra de navegación en la parte superior de la página */}
      <Nav cartOpen={cartOpen} />
      
      {/* Renderiza la sección hero específica de la página de productos */}
      <div style={getParallaxStyle(0.3)}> {/* Efecto parallax suave */}
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
            className="product-card-container"
            onMouseEnter={() => handleCardHover('promo-1')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-1' ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
            }}
          >
            <Card imageHeight={185} onAddToCart={handleAddToCart} />
          </div>
          <div 
            data-product-id="promo-2"
            className="product-card-container"
            onMouseEnter={() => handleCardHover('promo-2')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-2' ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
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
            className="product-card-container"
            onMouseEnter={() => handleCardHover('promo-3')}
            onMouseLeave={handleCardLeave}
            style={{
              transform: hoveredCard === 'promo-3' ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
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
      <Footer /> {/* Pie de página */}
    </>
  );
};

// Exporta el componente Products para ser usado en la configuración de enrutamiento de la aplicación
export default Products;
