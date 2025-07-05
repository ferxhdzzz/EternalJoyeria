import React, { useState } from 'react';
import Nav from '../components/Nav/Nav';
import '../components/ContactUs/ContactUs.css';
import ContactUsComponent from '../components/ContactUs/ContactUs';
import SidebarCart from '../components/Cart/SidebarCart';
import Footer from '../components/Footer';

// Si usas framer-motion para la animación, descomenta la siguiente línea:
// import { motion } from 'framer-motion';

const ContactUsPage = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div style={{ 
      background: '#FFFFFF', 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: '#FFFFFF'
    }}>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />
      {/* Título animado */}
      {/* Si usas framer-motion, reemplaza el div por motion.div y agrega animate/initial/transition */}
      <div
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingTop: '100px', 
          paddingBottom: '40px',
          backgroundColor: '#FFFFFF'
        }}
        className="contact-title-appear"
      >
        <h1
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: '4rem',
            color: '#4b1717',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-1px',
            backgroundColor: '#FFFFFF'
          }}
        >
          Contáctanos
        </h1>
        <p
          style={{
            fontFamily: 'Avenir, DM Sans, Arial, Helvetica, sans-serif',
            fontWeight: 400,
            fontSize: '1.3rem',
            color: '#6d4b4b',
            marginTop: '18px',
            textAlign: 'center',
            maxWidth: 600,
            backgroundColor: '#FFFFFF'
          }}
        >
          ¿Tienes dudas, comentarios o sugerencias? ¡Escríbenos y te responderemos lo antes posible!
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage; 