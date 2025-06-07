import React from 'react';
import '../../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <img src="/Products/EternalLogo.png" alt="Eternal Joyería" className="footer-logo" />
      <div className="footer-columns">
        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li>Inicio</li>
            <li>Sobre Nosotros</li>
            <li>Productos</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li>+54 9 11 2345 6789</li>
            <li>contacto@eternaljoyeria.com</li>
            <li>El Salvador, San Salvador</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p className="footer-phrase">Te ayudamos a encontrar tu joya deseada</p>
      <div className="footer-socials">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
      </div>
      <p className="footer-copy">© 2025 Eternal Joyería. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
