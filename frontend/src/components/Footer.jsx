import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  // Usar useState y useEffect para detectar cambios en el tamaño de la ventana
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className={`bloom-footer ${isMobile ? 'bloom-footer--mobile' : ''}`}>
      <div className="bloom-footer__container">
        <div className="bloom-footer__main">
          <div className="bloom-footer__left">
            <p className="bloom-footer__phrase">
              Encuentra tu calma,<br />
              una joya a la vez.
            </p>
            <div className="bloom-footer__socials">
              <a href="#" aria-label="TikTok" className="bloom-footer__social-link">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.5 16.5c-3.6 0-6.5-2.9-6.5-6.5V6h-6.5v27.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.7 0 1.3.2 1.9.5v-6.7c-.6-.1-1.3-.1-1.9-.1-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10V22.7c1.9 1.1 4.1 1.8 6.5 1.8v-8z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="bloom-footer__social-link">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.013 7.052.072 5.77.13 4.77.312 4.01.54c-.77.23-1.42.54-2.07 1.19C1.29 2.38.98 3.03.75 3.8.52 4.56.338 5.56.28 6.84.22 8.12.208 8.524.208 12c0 3.476.012 3.88.072 5.16.058 1.28.24 2.28.47 3.04.23.77.54 1.42 1.19 2.07.65.65 1.3.96 2.07 1.19.76.23 1.76.412 3.04.47C8.332 23.987 8.736 24 12 24s3.668-.013 4.948-.072c1.28-.058 2.28-.24 3.04-.47.77-.23 1.42-.54 2.07-1.19.65-.65.96-1.3 1.19-2.07.23-.76.412-1.76.47-3.04.06-1.28.072-1.684.072-5.16 0-3.476-.012-3.88-.072-5.16-.058-1.28-.24-2.28-.47-3.04-.23-.77-.54-1.42-1.19-2.07C21.62 1.29 20.97.98 20.2.75c-.76-.23-1.76-.412-3.04-.47C15.668.013 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A4 4 0 1 1 12 7.838a4 4 0 0 1 0 8.324zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="bloom-footer__social-link">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692V11.01h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
              </a>
            </div>
          </div>
          <div className="bloom-footer__nav">
            <div className="bloom-footer__nav-col">
              <h4>NAVEGACIÓN</h4>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
              </ul>
            </div>
            <div className="bloom-footer__nav-col">
              <h4>AYUDA</h4>
              <ul>
                <li><a href="/faq">Preguntas Frecuentes</a></li>
                <li><Link to="/contactanos">Contacto</Link></li>
              </ul>
            </div>
            <div className="bloom-footer__nav-col">
              <h4>BLOG</h4>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bloom-footer__bottom">
          <div className="bloom-footer__policies">
            <Link to="/privacidad">Política de Privacidad</Link>
            <span>·</span>
            <Link to="/cookies">Cookies</Link>
            <span>·</span>
            <Link to="/terminos">Términos y Condiciones</Link>
          </div>
          <div className="bloom-footer__copyright">
            © 2025 Eternal Joyería. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
