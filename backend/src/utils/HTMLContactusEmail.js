// utils/email.js
import nodemailer from "nodemailer";
import { config } from "../config.js";

// Configurar el transporter (CORREGIDO: createTransport en lugar de createTransporter)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

// Función para enviar correos
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.user,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.log("Error al enviar el email: " + error);
    throw error;
  }
};

// Función para generar HTML del email de contacto (compatible con tu controlador)
const HTMLContactusEmail = (fullName, email, phone, subject, message) => {
  const currentDate = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Eternal Joyería - Nuevo Mensaje de Contacto</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .email-container {
      width: 100%;
      max-width: 900px;
    }

    .email-card {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(22, 163, 74, 0.1);
      overflow: hidden;
      border: 1px solid #bbf7d0;
    }

    .header-section {
      background: #ecfdf5;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid #d1fae5;
    }

    .brand-logo {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: #16a34a;
      margin-bottom: 10px;
    }

    .main-title {
      font-size: 20px;
      color: #166534;
      font-weight: 600;
    }

    .subtitle {
      font-size: 13px;
      color: #4ade80;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .content-section {
      padding: 35px 40px;
    }

    .contact-info {
      background: #f0fdf4;
      padding: 25px;
      border-radius: 14px;
      margin-bottom: 25px;
      border: 1px solid #d1fae5;
    }

    .info-row {
      display: flex;
      margin-bottom: 12px;
      align-items: flex-start;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      font-weight: 600;
      color: #16a34a;
      min-width: 120px;
      font-size: 14px;
    }

    .info-value {
      color: #374151;
      font-size: 14px;
      flex: 1;
      word-break: break-word;
    }

    .message-section {
      background: #fdf4f9;
      border-radius: 16px;
      padding: 28px;
      border: 1px solid #f3d4e8;
      margin-top: 20px;
    }

    .message-label {
      font-size: 13px;
      color: #9d174d;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 15px;
    }

    .message-content {
      color: #374151;
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-line;
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #f3d4e8;
    }

    .timestamp-section {
      background: #fefce8;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #facc15;
      margin-top: 20px;
    }

    .timestamp-label {
      font-size: 12px;
      color: #ca8a04;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .timestamp-text {
      color: #78350f;
      font-size: 14px;
    }

    .footer-section {
      padding: 25px 20px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #d1fae5;
    }

    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .footer-link {
      color: #22c55e;
      font-weight: 600;
      text-decoration: none;
    }

    .footer-link:hover {
      color: #15803d;
    }

    @media (max-width: 768px) {
      .content-section {
        padding: 25px 20px;
      }

      .brand-logo {
        font-size: 26px;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .info-label {
        margin-bottom: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-card">
      <div class="header-section">
        <div class="brand-logo">Eternal Joyería</div>
        <div class="main-title">Nuevo Mensaje de Contacto</div>
        <p class="subtitle">Formulario Web | Contact Form</p>
      </div>

      <div class="content-section">
        <div class="contact-info">
          <div class="info-row">
            <div class="info-label">Nombre completo:</div>
            <div class="info-value">${fullName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${email}</div>
          </div>
          ${phone ? `
          <div class="info-row">
            <div class="info-label">Teléfono:</div>
            <div class="info-value">${phone}</div>
          </div>
          ` : ''}
          <div class="info-row">
            <div class="info-label">Asunto:</div>
            <div class="info-value">${subject}</div>
          </div>
        </div>

        <div class="message-section">
          <div class="message-label">Mensaje del Cliente</div>
          <div class="message-content">${message}</div>
        </div>

        <div class="timestamp-section">
          <div class="timestamp-label">Fecha y Hora</div>
          <div class="timestamp-text">Recibido el ${currentDate}</div>
        </div>
      </div>

      <div class="footer-section">
        <div class="footer-text">
          Responde directamente a este email: <a href="mailto:${email}" class="footer-link">${email}</a>
        </div>
        <div class="footer-text">
          Este mensaje fue enviado desde el formulario de contacto de eternal-joyeria-sigma.vercel.app
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export { sendMail, HTMLContactusEmail };