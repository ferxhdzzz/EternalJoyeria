import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/Footer.css'; // Imports the custom stylesheet for this component.

// Defines the Footer functional component.
const Footer = () => (
  // The main footer element for the page.
  <footer className="footer">
    {/* The top section of the footer, containing the logo and columns. */}
    <div className="footer-top">
      {/* The company logo image. */}
      <img src="/Products/EternalLogo.png" alt="Eternal Joyería" className="footer-logo" />
      {/* A container for the information and contact columns. */}
      <div className="footer-columns">
        {/* The column for general information links. */}
        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li>Inicio</li>
            <li>Sobre Nosotros</li>
            <li>Productos</li>
          </ul>
        </div>
        {/* The column for contact details. */}
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
    {/* The bottom section of the footer, containing a phrase, social media links, and copyright notice. */}
    <div className="footer-bottom">
      {/* A marketing or tagline phrase. */}
      <p className="footer-phrase">Te ayudamos a encontrar tu joya deseada</p>
      {/* A container for social media icons. */}
      <div className="footer-socials">
        {/* Link to Facebook (using Font Awesome icon). */}
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        {/* Link to Instagram (using Font Awesome icon). */}
        <a href="#"><i className="fab fa-instagram"></i></a>
        {/* Link to Twitter (using Font Awesome icon). */}
        <a href="#"><i className="fab fa-twitter"></i></a>
      </div>
      {/* The copyright notice. */}
      <p className="footer-copy">© 2025 Eternal Joyería. Todos los derechos reservados.</p>
    </div>
  </footer>
);

// Exports the Footer component to be used in other parts of the application.
export default Footer;
