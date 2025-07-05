import React, { useEffect, useState, useRef } from 'react';
// import './Home.css';

import Nav from '../components/Nav/Nav';
import Hero from '../components/Home/Hero/Hero';
import HeroCards from '../components/Home/HeroCards/HeroCards';
import HomePitch from '../components/Home/Pitch/HomePitch';
import OverlayCards from '../components/Home/Cards/OverlayCards';
import ElegantCards from '../components/Home/Cards/ElegantCards';
import HowItWorks from '../components/Home/HowItWorks/HowItWorks';
import Reviews from '../components/Home/reseñas/Reviews';
import SidebarCart from '../components/Cart/SidebarCart';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
// import Testimonials from '../components/ui/Testimonials';

const Home = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const { cartItems } = useCart();
  const sectionsRef = useRef({});

  useEffect(() => {
    // Hide scrollbar on the body when Home component is mounted
    document.body.style.overflow = 'hidden';
    // Set background color to white
    document.body.style.backgroundColor = '#FFFFFF';

    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'auto';
    }, 1500);

    // Scroll event listener
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determinar sección activa
      const sections = Object.keys(sectionsRef.current);
      for (let section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Restore scrollbar when component is unmounted
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
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
          Cargando Eternal Joyería...
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      
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

      {/* Navegación de secciones flotante */}
      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {['hero', 'pitch', 'cards', 'reviews', 'how-it-works'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: activeSection === section ? '#b94a6c' : '#ffd6de',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeSection === section ? 'scale(1.5)' : 'scale(1)'
            }}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
      </div>

      <div 
        ref={(el) => sectionsRef.current.hero = el}
        style={getParallaxStyle(0.3)}
      >
        <Hero />
      </div>
      
      <div 
        ref={(el) => sectionsRef.current.pitch = el}
        data-aos="fade-up"
        style={{
          opacity: scrollY > 200 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 200) * 0.1}px)`,
          transition: 'all 0.3s ease'
        }}
      >
        <HomePitch />
      </div>
      
      <div 
        ref={(el) => sectionsRef.current.cards = el}
        data-aos="fade-up"
        style={{
          opacity: scrollY > 400 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 400) * 0.1}px)`,
          transition: 'all 0.3s ease'
        }}
      >
        <OverlayCards />
      </div>
      
      <div style={getParallaxStyle(0.2)}>
        <HeroCards />
      </div>
      
      <div 
        ref={(el) => sectionsRef.current.reviews = el}
        data-aos="fade-up" 
        style={{ 
          backgroundColor: '#FFFFFF',
          opacity: scrollY > 600 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 600) * 0.1}px)`,
          transition: 'all 0.3s ease'
        }}
      >
        <Reviews />
      </div>
      
      <div 
        ref={(el) => sectionsRef.current['how-it-works'] = el}
        data-aos="fade-up"
        style={{
          opacity: scrollY > 800 ? 1 : 0.7,
          transform: `translateY(${Math.max(0, scrollY - 800) * 0.1}px)`,
          transition: 'all 0.3s ease'
        }}
      >
        <HowItWorks />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;
