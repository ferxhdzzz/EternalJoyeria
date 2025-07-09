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

export default function TermsPolicy() {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Términos y Condiciones</h1>
        <p style={styles.text}>
          Bienvenido a Eternal Joyería. Al utilizar nuestro sitio web y realizar compras, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente.
        </p>
        <h2 style={styles.subtitle}>Compras y pagos</h2>
        <p style={styles.text}>
          Todos los precios están expresados en dólares estadounidenses. Los pagos se procesan de forma segura a través de nuestras plataformas autorizadas. Nos reservamos el derecho de cancelar pedidos en caso de error en los precios o disponibilidad.
        </p>
        <h2 style={styles.subtitle}>Envíos</h2>
        <p style={styles.text}>
          Realizamos envíos a todo el país. Los plazos de entrega pueden variar según la ubicación y la disponibilidad del producto. Te notificaremos por email cuando tu pedido sea despachado.
        </p>
        <h2 style={styles.subtitle}>Devoluciones y cambios</h2>
        <p style={styles.text}>
          Si tu joya presenta algún defecto de fabricación, contáctanos dentro de los 7 días de recibido el pedido. No aceptamos devoluciones por mal uso o daño accidental.
        </p>
        <h2 style={styles.subtitle}>Propiedad intelectual</h2>
        <p style={styles.text}>
          Todo el contenido de este sitio (imágenes, textos, diseños) es propiedad de Eternal Joyería. Queda prohibida su reproducción sin autorización.
        </p>
        <h2 style={styles.subtitle}>Contacto</h2>
        <p style={styles.text}>
          Para cualquier consulta, escríbenos a <a href="mailto:contacto@eternaljoyeria.com" style={{color:'#b94a6c',textDecoration:'underline'}}>contacto@eternaljoyeria.com</a>.
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