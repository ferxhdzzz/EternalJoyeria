import React from 'react';

const PrivacyNotice = () => (
  <div style={{
    maxWidth: 700,
    margin: '60px auto',
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 4px 24px #ffd6de33',
    padding: '2.5rem 2rem',
    fontFamily: 'DM Sans, Arial, sans-serif',
    color: '#4b1717',
    lineHeight: 1.7
  }}>
    <h1 style={{ color: '#b94a6c', fontWeight: 700, fontSize: '2.2rem', marginBottom: 16 }}>Aviso de Privacidad</h1>
    <p>
      En <strong>Eternal Joyería</strong> nos comprometemos a proteger tu privacidad y tus datos personales. Esta página explica cómo recopilamos, usamos y protegemos la información que nos proporcionas a través de nuestro sitio web.
    </p>
    <h2 style={{ color: '#b94a6c', fontSize: '1.3rem', marginTop: 24 }}>¿Qué datos recopilamos?</h2>
    <ul style={{ marginLeft: 24 }}>
      <li>Nombre completo</li>
      <li>Correo electrónico</li>
      <li>Teléfono (opcional)</li>
      <li>Asunto y mensaje de contacto</li>
      <li>Información de navegación en nuestro sitio (cookies, solo para mejorar la experiencia)</li>
    </ul>
    <h2 style={{ color: '#b94a6c', fontSize: '1.3rem', marginTop: 24 }}>¿Para qué usamos tus datos?</h2>
    <ul style={{ marginLeft: 24 }}>
      <li>Responder tus dudas, comentarios o solicitudes.</li>
      <li>Mejorar nuestro servicio y atención al cliente.</li>
      <li>Enviarte información relevante sobre tus pedidos o promociones (solo si lo autorizas).</li>
    </ul>
    <h2 style={{ color: '#b94a6c', fontSize: '1.3rem', marginTop: 24 }}>¿Cómo protegemos tu información?</h2>
    <ul style={{ marginLeft: 24 }}>
      <li>No compartimos tus datos con terceros, salvo obligación legal.</li>
      <li>Utilizamos medidas de seguridad para proteger tu información.</li>
      <li>Puedes solicitar la eliminación o corrección de tus datos en cualquier momento.</li>
    </ul>
    <h2 style={{ color: '#b94a6c', fontSize: '1.3rem', marginTop: 24 }}>Tus derechos</h2>
    <p>
      Puedes acceder, rectificar o eliminar tus datos personales enviando un correo a <a href="mailto:contacto@eternaljoyeria.com" style={{ color: '#b94a6c', textDecoration: 'underline' }}>contacto@eternaljoyeria.com</a>.
    </p>
    <p style={{ marginTop: 32, color: '#b94a6c', fontWeight: 600 }}>
      Si tienes dudas sobre este aviso de privacidad, contáctanos. ¡Tu confianza es lo más importante para nosotros!
    </p>
  </div>
);

export default PrivacyNotice; 