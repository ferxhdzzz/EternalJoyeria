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

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Política de Privacidad</h1>
        <p style={styles.text}>
          En Eternal Joyería, tu privacidad es fundamental para nosotros. Nos comprometemos a proteger tus datos personales y a usarlos únicamente para brindarte la mejor experiencia posible en nuestra tienda.
        </p>
        <h2 style={styles.subtitle}>¿Qué datos recopilamos?</h2>
        <p style={styles.text}>
          Recopilamos información que nos proporcionas al realizar una compra, registrarte o contactarnos: nombre, correo electrónico, dirección de envío, teléfono y detalles de tu pedido. También podemos recopilar información sobre tu navegación en nuestro sitio para mejorar nuestros servicios.
        </p>
        <h2 style={styles.subtitle}>¿Cómo usamos tus datos?</h2>
        <p style={styles.text}>
          Utilizamos tus datos para procesar tus pedidos, enviarte confirmaciones, brindarte atención personalizada y, si lo autorizas, enviarte novedades y promociones exclusivas. Nunca compartimos tu información con terceros, salvo empresas de mensajería para el envío de tus joyas.
        </p>
        <h2 style={styles.subtitle}>Seguridad y confidencialidad</h2>
        <p style={styles.text}>
          Protegemos tus datos con medidas de seguridad técnicas y organizativas. Solo el personal autorizado puede acceder a tu información y siempre bajo estricta confidencialidad.
        </p>
        <h2 style={styles.subtitle}>Tus derechos</h2>
        <p style={styles.text}>
          Puedes solicitar el acceso, rectificación o eliminación de tus datos en cualquier momento. Escríbenos a <a href="mailto:contacto@eternaljoyeria.com" style={{color:'#b94a6c',textDecoration:'underline'}}>contacto@eternaljoyeria.com</a> para ejercer tus derechos o resolver cualquier duda sobre privacidad.
        </p>
        <h2 style={styles.subtitle}>Actualizaciones</h2>
        <p style={styles.text}>
          Esta política puede actualizarse para reflejar cambios en la ley o en nuestros procesos. Te recomendamos revisarla periódicamente.
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