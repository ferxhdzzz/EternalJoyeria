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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eternal Joyería - Email Verification</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
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
            padding: 15px;
        }
        
        .email-container {
            width: 100%;
            max-width: 480px;
        }
        
        .email-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px -12px rgba(34, 197, 94, 0.25);
            overflow: hidden;
            border: 1px solid rgba(34, 197, 94, 0.1);
        }
        
        .header-section {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            padding: 30px 20px 25px;
            text-align: center;
            border-top: 3px solid #22c55e;
        }
        
        .brand-logo {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #16a34a;
            margin-bottom: 8px;
        }
        
        .main-title {
            font-size: 18px;
            font-weight: 600;
            color: #16a34a;
            margin-bottom: 4px;
        }
        
        .subtitle {
            font-size: 12px;
            color: #22c55e;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-section {
            padding: 25px 20px;
        }
        
        .welcome-message {
            background: #f0fdf4;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid rgba(34, 197, 94, 0.1);
        }
        
        .language-block {
            margin-bottom: 12px;
        }
        
        .language-block:last-child {
            margin-bottom: 0;
        }
        
        .language-label {
            font-weight: 600;
            color: #16a34a;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .language-text {
            color: #6b7280;
            line-height: 1.5;
            font-size: 14px;
        }
        
        .code-section {
            text-align: center;
            margin: 25px 0;
        }
        
        .code-container {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 16px;
            padding: 24px 20px;
            box-shadow: 0 15px 30px -8px rgba(34, 197, 94, 0.4);
        }
        
        .code-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }
        
        .verification-code {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            font-family: 'Inter', monospace;
            letter-spacing: 4px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .timer-section {
            background: linear-gradient(135deg, #fefce8, #fef3c7);
            border-radius: 12px;
            padding: 18px;
            margin: 25px 0;
            border-left: 3px solid #eab308;
        }
        
        .timer-content {
            margin-bottom: 10px;
        }
        
        .timer-content:last-child {
            margin-bottom: 0;
        }
        
        .timer-label {
            font-weight: 600;
            color: #a16207;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .timer-text {
            color: #92400e;
            line-height: 1.5;
            font-size: 13px;
        }
        
        .footer-section {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid rgba(34, 197, 94, 0.1);
        }
        
        .support-info {
            margin-bottom: 10px;
        }
        
        .support-info:last-child {
            margin-bottom: 0;
        }
        
        .support-label {
            font-weight: 600;
            color: #16a34a;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .support-text {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
        }
        
        .support-link {
            color: #22c55e;
            text-decoration: none;
            font-weight: 600;
        }
        
        .support-link:hover {
            color: #16a34a;
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
            body { padding: 10px; }
            .header-section { padding: 25px 15px 20px; }
            .brand-logo { font-size: 22px; }
            .main-title { font-size: 16px; }
            .content-section { padding: 20px 15px; }
            .welcome-message { padding: 16px; }
            .code-container { padding: 20px 16px; }
            .verification-code { font-size: 24px; letter-spacing: 3px; }
            .timer-section { padding: 16px; }
            .footer-section { padding: 16px; }
        }
        
        @media (max-width: 360px) {
            .brand-logo { font-size: 20px; }
            .main-title { font-size: 15px; }
            .verification-code { font-size: 22px; letter-spacing: 2px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header-section">
                <div class="brand-logo">Eternal Joyería</div>
                <h1 class="main-title">Email Verification | Verificación de Email</h1>
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
                        <div class="timer-text">
                            This code will expire in <strong>2 Hours</strong>. If you didn't sign up, you can ignore this email.
                        </div>
                    </div>
                    <div class="timer-content">
                        <div class="timer-label">Español</div>
                        <div class="timer-text">
                            Este código expirará en <strong>2 Horas</strong>. Si no te registraste, puedes ignorar este email.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-section">
                <div class="support-info">
                    <div class="support-label">English</div>
                    <div class="support-text">
                        Need help? Contact us at 
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
                    </div>
                </div>
                <div class="support-info">
                    <div class="support-label">Español</div>
                    <div class="support-text">
                        ¿Necesitas ayuda? Contáctanos en 
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
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
