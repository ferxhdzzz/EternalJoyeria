import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="custom-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <img src="/EternalLogo.png" alt="Eternal Logo" className="footer-logo" />
        <p className="footer-help">Te ayudamos a encontrar tu joya deseada</p>
        <div className="footer-socials">
          <a href="#" aria-label="Facebook" className="footer-social-link">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" className="footer-social-link">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.217.598 1.77.97.554.373.998.917 1.25 1.77.248.638.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-.97 1.77c-.373.554-.917.998-1.77 1.25-.638.248-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.883 4.883 0 0 1-1.77-.97c-.554-.373-.998-.917-1.25-1.77-.248-.638-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.013-3.056.06-4.122c.05-1.065.218-1.79.465-2.428.254-.66.598-1.217.97-1.77.373-.554.917-.998 1.77-1.25.638-.248 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.8c-2.649 0-2.984.01-4.04.057-.975.045-1.504.207-1.857.344-.466.182-.79.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.056-.057 1.391-.057 4.04s.01 2.984.057 4.04c.045.975.207 1.504.344 1.857.182.466.398.79.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.056.048 1.391.057 4.04.057s2.984-.01 4.04-.057c.975-.045 1.504-.207 1.857-.344.466-.182.79-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.056.057-1.391.057-4.04s-.01-2.984-.057-4.04c-.045-.975-.207-1.504-.344-1.857-.182-.466-.398-.79-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344C14.984 3.81 14.649 3.8 12 3.8zm0 3.35c-2.828 0-5.117 2.29-5.117 5.117s2.29 5.117 5.117 5.117 5.117-2.29 5.117-5.117-2.29-5.117-5.117-5.117zm0 8.433c-1.833 0-3.317-1.483-3.317-3.317S10.167 8.7 12 8.7s3.317 1.483 3.317 3.317S13.833 15.583 12 15.583zm4.4-8.017c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2 1.2-.54 1.2-1.2-.54-1.2-1.2-1.2z"/></svg>
          </a>
          <a href="#" aria-label="Twitter" className="footer-social-link">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
      <div className="footer-info-blocks">
        <div className="footer-info">
          <h4>Information</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
            <li><a href="/products">Productos</a></li>
          </ul>
        </div>
        <div className="footer-info">
          <h4>Contacto</h4>
          <ul>
            <li>+54 9 11 2345 6789</li>
            <li><a href="mailto:contacto@eternaljoyeria.com">contacto@eternaljoyeria.com</a></li>
            <li>El Salvador, San Salvador</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 Eternal Joyería. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
