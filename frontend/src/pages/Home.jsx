// Importaciones necesarias para la página de inicio
import React, { useEffect, useState, useRef } from 'react'; // React y hooks para efectos, estado y referencias
// import './Home.css'; // Estilos CSS específicos de la página de inicio (comentado)

// Importaciones de componentes de navegación y estructura
import Nav from '../components/Nav/Nav'; // Componente de navegación principal
import Footer from '../components/Footer'; // Componente del pie de página

// Importaciones de componentes del hero y secciones principales
import Hero from '../components/Home/Hero/Hero'; // Componente principal del hero
import HeroCards from '../components/Home/HeroCards/HeroCards'; // Tarjetas del hero
import HomePitch from '../components/Home/Pitch/HomePitch'; // Sección de presentación

// Importaciones de componentes de tarjetas y contenido
import OverlayCards from '../components/Home/Cards/OverlayCards'; // Tarjetas con overlay
import ElegantCards from '../components/Home/Cards/ElegantCards'; // Tarjetas elegantes
import HowItWorks from '../components/Home/HowItWorks/HowItWorks'; // Sección "Cómo funciona"
import Reviews from '../components/Home/reseñas/Reviews'; // Sección de reseñas

// Importaciones de componentes del carrito
import SidebarCart from '../components/Cart/SidebarCart'; // Carrito lateral
import { useCart } from '../context/CartContext'; // Hook del contexto del carrito

// import Testimonials from '../components/ui/Testimonials'; // Componente de testimonios (comentado)

// Componente principal de la página de inicio
const Home = () => {
  // Estados para controlar el comportamiento de la página
  const [cartOpen, setCartOpen] = useState(false); // Estado del carrito lateral (abierto/cerrado)
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial
  const [scrollY, setScrollY] = useState(0); // Posición actual del scroll
  const [activeSection, setActiveSection] = useState('hero'); // Sección activa actual
  const { cartItems } = useCart(); // Obtener items del carrito desde el contexto
  const sectionsRef = useRef({}); // Referencias a las diferentes secciones de la página

  // Efecto principal que se ejecuta al montar el componente
  useEffect(() => {
    // Ocultar scrollbar del body cuando se monta el componente Home
    document.body.style.overflow = 'hidden';
    // Establecer color de fondo blanco
    document.body.style.backgroundColor = '#FFFFFF';

    // Simular carga inicial con un timer
    const timer = setTimeout(() => {
      setIsLoading(false); // Finalizar estado de carga
      document.body.style.overflow = 'auto'; // Restaurar scrollbar
    }, 1500); // 1.5 segundos de carga simulada

    // Listener para eventos de scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY; // Obtener posición actual del scroll
      setScrollY(currentScrollY); // Actualizar estado del scroll
      
      // Determinar qué sección está activa basándose en la posición del scroll
      const sections = Object.keys(sectionsRef.current);
      for (let section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const rect = element.getBoundingClientRect(); // Obtener posición del elemento
          if (rect.top <= 100 && rect.bottom >= 100) { // Si el elemento está en el viewport
            setActiveSection(section); // Actualizar sección activa
            break;
          }
        }
      }
    };

    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll);

    // Función de limpieza que se ejecuta al desmontar el componente
    return () => {
      clearTimeout(timer); // Limpiar timer
      document.body.style.overflow = 'auto'; // Restaurar scrollbar
      window.removeEventListener('scroll', handleScroll); // Remover listener de scroll
    };
  }, []); // Array vacío asegura que esto se ejecute solo una vez al montar

  // Función para hacer scroll suave a una sección específica
  const scrollToSection = (sectionId) => {
    const element = sectionsRef.current[sectionId]; // Obtener referencia al elemento
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', // Scroll suave
        block: 'start' // Alinear al inicio del viewport
      });
    }
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
          Cargando Eternal Joyería...
        </div>
      </div>
    );
  }

  // Renderizado principal de la página de inicio
  return (
    <div style={{ backgroundColor: '#FFFFFF' }}> {/* Contenedor principal con fondo blanco */}
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} /> {/* Carrito lateral */}
      <Nav cartOpen={cartOpen} /> {/* Navegación principal */}
      
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

      {/* Sección Hero - Sección principal con efecto parallax */}
      <div 
        ref={(el) => sectionsRef.current.hero = el} // Referencia para tracking de sección
        style={getParallaxStyle(0.3)} // Efecto parallax suave
      >
        <Hero />
      </div>
      
      {/* Sección de presentación (Pitch) - Sección de información de la empresa */}
      <div 
        ref={(el) => sectionsRef.current.pitch = el} // Referencia para tracking
        data-aos="fade-up" // Animación de aparición al hacer scroll
        style={{
          opacity: scrollY > 200 ? 1 : 0.7, // Opacidad basada en scroll
          transform: `translateY(${Math.max(0, scrollY - 200) * 0.1}px)`, // Movimiento suave
          transition: 'all 0.3s ease' // Transición
        }}
      >
        <HomePitch />
      </div>
      
      {/* Sección de tarjetas (comentada) - Eliminada por Codi */}
      <div 
        ref={(el) => sectionsRef.current.cards = el} // Referencia para tracking
        data-aos="fade-up" // Animación de aparición
        style={{
          opacity: scrollY > 400 ? 1 : 0.7, // Opacidad basada en scroll
          transform: `translateY(${Math.max(0, scrollY - 400) * 0.1}px)`, // Movimiento suave
          transition: 'all 0.3s ease' // Transición
        }}
      >
        {/* <OverlayCards /> Eliminado por Codi */}
      </div>
      
      {/* Sección de tarjetas del hero - Con efecto parallax */}
      <div style={getParallaxStyle(0.2)}> {/* Efecto parallax más suave */}
        <HeroCards />
      </div>
      
      {/* Sección de reseñas - Sección de testimonios de clientes */}
      <div 
        ref={(el) => sectionsRef.current.reviews = el} // Referencia para tracking
        data-aos="fade-up" // Animación de aparición
        style={{ 
          backgroundColor: '#FFFFFF', // Fondo blanco
          opacity: scrollY > 600 ? 1 : 0.7, // Opacidad basada en scroll
          transform: `translateY(${Math.max(0, scrollY - 600) * 0.1}px)`, // Movimiento suave
          transition: 'all 0.3s ease' // Transición
        }}
      >
        <Reviews />
      </div>
      
      {/* Sección "Cómo funciona" - Sección explicativa del proceso */}
      <div 
        ref={(el) => sectionsRef.current['how-it-works'] = el} // Referencia para tracking
        data-aos="fade-up" // Animación de aparición
        style={{
          opacity: scrollY > 800 ? 1 : 0.7, // Opacidad basada en scroll
          transform: `translateY(${Math.max(0, scrollY - 800) * 0.1}px)`, // Movimiento suave
          transition: 'all 0.3s ease' // Transición
        }}
      >
        <HowItWorks />
      </div>
      
      <Footer /> {/* Pie de página */}
    </div>
  );
};

// Exporta el componente Home para ser usado en el enrutador
export default Home;
