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
  return `
      <!DOCTYPE html>
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
            background: linear-gradient(135deg, #fdf2f8, #fce7f3);
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
            box-shadow: 0 20px 40px -12px rgba(236, 72, 153, 0.25);
            overflow: hidden;
            border: 1px solid rgba(236, 72, 153, 0.1);
        }
        
        .header-section {
            background: linear-gradient(135deg, #fdf2f8, #fce7f3);
            padding: 30px 20px 25px;
            text-align: center;
            border-top: 3px solid #ec4899;
        }
        
        .brand-logo {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #be185d;
            margin-bottom: 8px;
        }
        
        .main-title {
            font-size: 18px;
            font-weight: 600;
            color: #be185d;
            margin-bottom: 4px;
        }
        
        .subtitle {
            font-size: 12px;
            color: #db2777;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-section {
            padding: 25px 20px;
        }
        
        .welcome-message {
            background: #fdf2f8;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid rgba(236, 72, 153, 0.1);
        }
        
        .language-block {
            margin-bottom: 12px;
        }
        
        .language-block:last-child {
            margin-bottom: 0;
        }
        
        .language-label {
            font-weight: 600;
            color: #be185d;
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
            background: linear-gradient(135deg, #ec4899, #db2777);
            border-radius: 16px;
            padding: 24px 20px;
            box-shadow: 0 15px 30px -8px rgba(236, 72, 153, 0.4);
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
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            border-radius: 12px;
            padding: 18px;
            margin: 25px 0;
            border-left: 3px solid #f59e0b;
        }
        
        .timer-content {
            margin-bottom: 10px;
        }
        
        .timer-content:last-child {
            margin-bottom: 0;
        }
        
        .timer-label {
            font-weight: 600;
            color: #92400e;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .timer-text {
            color: #78350f;
            line-height: 1.5;
            font-size: 13px;
        }
        
        .footer-section {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid rgba(236, 72, 153, 0.1);
        }
        
        .support-info {
            margin-bottom: 10px;
        }
        
        .support-info:last-child {
            margin-bottom: 0;
        }
        
        .support-label {
            font-weight: 600;
            color: #be185d;
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
            color: #db2777;
            text-decoration: none;
            font-weight: 600;
        }
        
        .support-link:hover {
            color: #be185d;
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
                        <div class="verification-code" id="verification-code">ABC123</div>
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

    <script>
        function generateRandomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        function updateCode() {
            const codeElement = document.getElementById('verification-code');
            codeElement.style.opacity = '0.5';
            
            setTimeout(() => {
                codeElement.textContent = generateRandomCode();
                codeElement.style.opacity = '1';
            }, 200);
        }

        document.addEventListener('DOMContentLoaded', function() {
            const codeElement = document.getElementById('verification-code');
            codeElement.style.transition = 'opacity 0.2s ease';
            setInterval(updateCode, 6000);
        });
    </script>
</body>
</html>
    `;
};

export { sendEmail, HTMLRecoveryEmail };