// utils/email.js
import nodemailer from "nodemailer";
import { config } from "../config.js";

// Configurar el transporter
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

// Plantilla de correo de verificación
const HTMLEmailVerification = (code) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Eternal Joyería - Verificación</title>
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

    .welcome-message {
      background: #f0fdf4;
      padding: 25px;
      border-radius: 14px;
      margin-bottom: 30px;
      border: 1px solid #d1fae5;
    }

    .language-block {
      margin-bottom: 16px;
    }

    .language-label {
      font-size: 12px;
      color: #16a34a;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .language-text {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
    }

    .code-section {
      text-align: center;
      margin: 30px 0;
    }

    .code-container {
      background: #fdf4f9;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 8px 24px rgba(214, 150, 191, 0.3);
      border: 1px solid #f3d4e8;
    }

    .code-label {
      font-size: 13px;
      color: #9d174d;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .verification-code {
      font-size: 36px;
      color: #D696BF;
      font-weight: 700;
      letter-spacing: 6px;
      font-family: 'Inter', monospace;
      text-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .timer-section {
      background: #fefce8;
      padding: 24px;
      border-radius: 12px;
      border-left: 4px solid #facc15;
      margin-top: 20px;
    }

    .timer-label {
      font-size: 12px;
      color: #ca8a04;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .timer-text {
      color: #78350f;
      font-size: 14px;
      line-height: 1.5;
    }

    .footer-section {
      padding: 25px 20px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #d1fae5;
    }

    .support-label {
      font-size: 12px;
      color: #16a34a;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .support-text {
      font-size: 14px;
      color: #374151;
    }

    .support-link {
      color: #22c55e;
      font-weight: 600;
      text-decoration: none;
    }

    .support-link:hover {
      color: #15803d;
    }

    @media (max-width: 768px) {
      .content-section {
        padding: 25px 20px;
      }

      .brand-logo {
        font-size: 26px;
      }

      .verification-code {
        font-size: 30px;
        letter-spacing: 4px;
      }
    }

    @media (max-width: 480px) {
      .verification-code {
        font-size: 24px;
        letter-spacing: 3px;
      }

      .header-section, .content-section, .footer-section {
        padding: 20px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-card">
      <div class="header-section">
        <div class="brand-logo">Eternal Joyería</div>
        <div class="main-title">Email Verification | Verificación de Email</div>
        <p class="subtitle">Secure Registration | Registro Seguro</p>
      </div>

      <div class="content-section">
        <div class="welcome-message">
          <div class="language-block">
            <div class="language-label">English</div>
            <div class="language-text">
              Thank you for registering! Use the verification code below to confirm your email address.
            </div>
          </div>
          <div class="language-block">
            <div class="language-label">Español</div>
            <div class="language-text">
              ¡Gracias por registrarte! Usa el código de verificación a continuación para confirmar tu dirección de email.
            </div>
          </div>
        </div>

        <div class="code-section">
          <div class="code-container">
            <div class="code-label">Verification Code | Código de Verificación</div>
            <div class="verification-code">${code}</div>
          </div>
        </div>

        <div class="timer-section">
          <div class="timer-content">
            <div class="timer-label">English</div>
            <div class="timer-text">This code will expire in <strong>2 Hours</strong>. If you didn't sign up, you can ignore this email.</div>
          </div>
          <div class="timer-content" style="margin-top: 10px;">
            <div class="timer-label">Español</div>
            <div class="timer-text">Este código expirará en <strong>2 Horas</strong>. Si no te registraste, puedes ignorar este email.</div>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <div class="support-info">
          <div class="support-label">English</div>
          <div class="support-text">
            Need help? Contact us at <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
          </div>
        </div>
        <div class="support-info" style="margin-top: 10px;">
          <div class="support-label">Español</div>
          <div class="support-text">
            ¿Necesitas ayuda? Contáctanos en <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

  `;
};

export { sendMail, HTMLEmailVerification };
