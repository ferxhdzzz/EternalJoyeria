import nodemailer from "nodemailer";
import { config } from "../config.js";

// Configurar el transporter
// ¿Quien envía el correo?
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

// ¿Quien lo envia?
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.user, // Usar el email de configuración
      to, // Para quien
      subject, // El asunto
      text, // Texto plano (cambié de 'body' a 'text')
      html, // HTML
    });

    return info;
  } catch (error) {
    console.log("error" + error);
    throw error; // Re-lanzar el error para manejarlo en el controlador
  }
};

// Función para generar el HTML del correo de recuperación de contraseña
const HTMLRecoveryEmail = (code) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eternal Joyería - Password Recovery</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #fef7f7, #fce7e7);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }
        
        .email-container {
            width: 100%;
            max-width: 720px;
        }
        
        .email-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px -12px rgba(251, 113, 133, 0.25);
            overflow: hidden;
            border: 1px solid rgba(251, 113, 133, 0.1);
        }
        
        .header-section {
            background: linear-gradient(135deg, #fef7f7, #fce7e7);
            padding: 40px 30px 35px;
            text-align: center;
            border-top: 3px solid #f472b6;
        }
        
        .brand-logo {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: #ec4899;
            margin-bottom: 12px;
        }
        
        .main-title {
            font-size: 24px;
            font-weight: 600;
            color: #ec4899;
            margin-bottom: 6px;
        }
        
        .subtitle {
            font-size: 14px;
            color: #f472b6;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-section {
            padding: 35px 30px;
        }
        
        .welcome-message {
            background: #fef7f7;
            border-radius: 16px;
            padding: 28px;
            margin-bottom: 35px;
            border: 1px solid rgba(251, 113, 133, 0.1);
        }
        
        .language-block {
            margin-bottom: 16px;
        }
        
        .language-block:last-child {
            margin-bottom: 0;
        }
        
        .language-label {
            font-weight: 600;
            color: #ec4899;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .language-text {
            color: #6b7280;
            line-height: 1.6;
            font-size: 16px;
        }
        
        .code-section {
            text-align: center;
            margin: 35px 0;
        }
        
        .code-container {
            background: linear-gradient(135deg, #f472b6, #ec4899);
            border-radius: 20px;
            padding: 32px 28px;
            box-shadow: 0 15px 30px -8px rgba(251, 113, 133, 0.4);
        }
        
        .code-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
        }
        
        .verification-code {
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            font-family: 'Inter', monospace;
            letter-spacing: 5px;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .timer-section {
            background: linear-gradient(135deg, #fef3f3, #fce7e7);
            border-radius: 16px;
            padding: 24px;
            margin: 35px 0;
            border-left: 3px solid #fb7185;
        }
        
        .timer-content {
            margin-bottom: 14px;
        }
        
        .timer-content:last-child {
            margin-bottom: 0;
        }
        
        .timer-label {
            font-weight: 600;
            color: #e11d48;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .timer-text {
            color: #be123c;
            line-height: 1.6;
            font-size: 15px;
        }
        
        .footer-section {
            background: #fef7f7;
            padding: 28px;
            text-align: center;
            border-top: 1px solid rgba(251, 113, 133, 0.1);
        }
        
        .support-info {
            margin-bottom: 14px;
        }
        
        .support-info:last-child {
            margin-bottom: 0;
        }
        
        .support-label {
            font-weight: 600;
            color: #ec4899;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .support-text {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .support-link {
            color: #f472b6;
            text-decoration: none;
            font-weight: 600;
        }
        
        .support-link:hover {
            color: #ec4899;
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

        /* Larger screen optimizations */
        @media (min-width: 1024px) {
            .brand-logo {
                font-size: 40px;
            }

            .main-title {
                font-size: 30px;
            }

            .subtitle {
                font-size: 16px;
            }

            .language-text,
            .timer-text,
            .support-text {
                font-size: 18px;
            }

            .verification-code {
                font-size: 48px;
                letter-spacing: 6px;
            }

            .code-container {
                padding: 48px 40px;
            }

            .welcome-message,
            .timer-section,
            .footer-section,
            .content-section {
                padding: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header-section">
                <div class="brand-logo">Eternal Joyería</div>
                <h1 class="main-title">Password Recovery | Recuperación de Contraseña</h1>
                <p class="subtitle">Secure Access | Acceso Seguro</p>
            </div>
            
            <div class="content-section">
                <div class="welcome-message">
                    <div class="language-block">
                        <div class="language-label">English</div>
                        <div class="language-text">
                            Hello! We received a request to reset your password. Use the verification code below to proceed with your account recovery.
                        </div>
                    </div>
                    <div class="language-block">
                        <div class="language-label">Español</div>
                        <div class="language-text">
                            ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña. Usa el código de verificación a continuación para continuar con la recuperación de tu cuenta.
                        </div>
                    </div>
                </div>
                
                <div class="code-section">
                    <div class="code-container">
                        <div class="code-label">Verification Code | Código de Verificación</div>
                        <div class="verification-code" id="verification-code">${code}</div>
                    </div>
                </div>
                
                <div class="timer-section">
                    <div class="timer-content">
                        <div class="timer-label">English</div>
                        <div class="timer-text">
                            This code is valid for the next <strong>15 minutes</strong>. If you didn't request this email, you can safely ignore it.
                        </div>
                    </div>
                    <div class="timer-content">
                        <div class="timer-label">Español</div>
                        <div class="timer-text">
                            Este código es válido por los próximos <strong>15 minutos</strong>. Si no solicitaste este correo, puedes ignorarlo de forma segura.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-section">
                <div class="support-info">
                    <div class="support-label">English</div>
                    <div class="support-text">
                        If you need further assistance, please contact our support team at 
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
                    </div>
                </div>
                <div class="support-info">
                    <div class="support-label">Español</div>
                    <div class="support-text">
                        Si necesitas asistencia adicional, por favor contacta a nuestro equipo de soporte en 
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

export { sendEmail, HTMLRecoveryEmail };