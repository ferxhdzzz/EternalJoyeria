import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  wrapper: {
    background: 'linear-gradient(to top, #fde6e9 0%, #fff 100%)',
    minHeight: '100vh',
    fontFamily: 'DM Sans, Arial, sans-serif',
    color: '#4B1717',
    padding: '0',
  },
  container: {
    maxWidth: 700,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    boxShadow: '0 4px 24px rgba(253,230,233,0.15)',
    padding: '48px 28px 32px 28px',
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: '2.3rem',
    fontWeight: 900,
    color: '#b94a6c',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#4B1717',
    marginTop: 32,
    marginBottom: 10,
  },
  text: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    marginBottom: 18,
  },
  button: {
    display: 'block',
    margin: '36px auto 0 auto',
    background: '#fde6e9',
    color: '#4B1717',
    border: 'none',
    borderRadius: 999,
    padding: '14px 38px',
    fontWeight: 900,
    fontSize: '1.08rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(185,74,108,0.07)',
    transition: 'background 0.18s, color 0.18s',
  },
  buttonHover: {
    background: '#b94a6c',
    color: '#fff',
  },
};

export default function CookiesPolicy() {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Política de Cookies</h1>
        <p style={styles.text}>
          En Eternal Joyería utilizamos cookies para mejorar tu experiencia de navegación y personalizar el contenido que ves. Las cookies nos ayudan a entender tus preferencias y a ofrecerte un servicio más eficiente y adaptado a ti.
        </p>
        <h2 style={styles.subtitle}>¿Qué son las cookies?</h2>
        <p style={styles.text}>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos permiten reconocerte en futuras visitas y recordar tus preferencias.
        </p>
        <h2 style={styles.subtitle}>¿Para qué usamos las cookies?</h2>
        <p style={styles.text}>
          Utilizamos cookies para:
          <ul style={{marginTop:8,marginBottom:8,paddingLeft:24}}>
            <li>Recordar tus preferencias de navegación.</li>
            <li>Analizar el uso de nuestro sitio y mejorar nuestros servicios.</li>
            <li>Mostrarte contenido personalizado y promociones relevantes.</li>
          </ul>
        </p>
        <h2 style={styles.subtitle}>¿Puedo desactivar las cookies?</h2>
        <p style={styles.text}>
          Sí, puedes configurar tu navegador para rechazar o eliminar las cookies. Sin embargo, esto puede afectar el funcionamiento de algunas partes de nuestro sitio.
        </p>
        <h2 style={styles.subtitle}>Más información</h2>
        <p style={styles.text}>
          Si tienes dudas sobre nuestra política de cookies, escríbenos a <a href="mailto:contacto@eternaljoyeria.com" style={{color:'#b94a6c',textDecoration:'underline'}}>contacto@eternaljoyeria.com</a>.
        </p>
        <button
          style={hover ? {...styles.button, ...styles.buttonHover} : styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
} 