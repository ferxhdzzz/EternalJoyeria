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
      text, // Texto plano
      html, // HTML
    });

    return info;
  } catch (error) {
    console.log("error" + error);
    throw error; // Re-lanzar el error para manejarlo en el controlador
  }
};

// Plantilla de correo de bienvenida
const HTMLWelcomeEmail = (firstName) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eternal Joyería - Welcome</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
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
            box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.25);
            overflow: hidden;
            border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .header-section {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 30px 20px 25px;
            text-align: center;
            border-top: 3px solid #3b82f6;
        }
        
        .brand-logo {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 8px;
        }
        
        .main-title {
            font-size: 18px;
            font-weight: 600;
            color: #1d4ed8;
            margin-bottom: 4px;
        }
        
        .subtitle {
            font-size: 12px;
            color: #3b82f6;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-section {
            padding: 25px 20px;
        }
        
        .welcome-message {
            background: #f0f9ff;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .language-block {
            margin-bottom: 12px;
        }
        
        .language-block:last-child {
            margin-bottom: 0;
        }
        
        .language-label {
            font-weight: 600;
            color: #1d4ed8;
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
        
        .name-highlight {
            color: #1d4ed8;
            font-weight: 600;
        }
        
        .celebration-section {
            text-align: center;
            margin: 25px 0;
        }
        
        .celebration-container {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 16px;
            padding: 24px 20px;
            box-shadow: 0 15px 30px -8px rgba(59, 130, 246, 0.4);
        }
        
        .celebration-icon {
            font-size: 40px;
            margin-bottom: 12px;
        }
        
        .celebration-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        
        .celebration-message {
            font-size: 20px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .benefits-section {
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            border-radius: 12px;
            padding: 18px;
            margin: 25px 0;
            border-left: 3px solid #f59e0b;
        }
        
        .benefits-content {
            margin-bottom: 12px;
        }
        
        .benefits-content:last-child {
            margin-bottom: 0;
        }
        
        .benefits-label {
            font-weight: 600;
            color: #92400e;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .benefits-list {
            color: #78350f;
            line-height: 1.6;
            font-size: 13px;
        }
        
        .benefits-list ul {
            margin: 0;
            padding-left: 16px;
        }
        
        .benefits-list li {
            margin-bottom: 4px;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
            border: 1px solid rgba(34, 197, 94, 0.1);
        }
        
        .cta-content {
            margin-bottom: 12px;
        }
        
        .cta-content:last-child {
            margin-bottom: 0;
        }
        
        .cta-label {
            font-weight: 600;
            color: #16a34a;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .cta-text {
            color: #15803d;
            line-height: 1.5;
            font-size: 14px;
            font-weight: 500;
        }
        
        .footer-section {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .support-info {
            margin-bottom: 10px;
        }
        
        .support-info:last-child {
            margin-bottom: 0;
        }
        
        .support-label {
            font-weight: 600;
            color: #1d4ed8;
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
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
        }
        
        .support-link:hover {
            color: #1d4ed8;
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
            body { padding: 10px; }
            .header-section { padding: 25px 15px 20px; }
            .brand-logo { font-size: 22px; }
            .main-title { font-size: 16px; }
            .content-section { padding: 20px 15px; }
            .welcome-message { padding: 16px; }
            .celebration-container { padding: 20px 16px; }
            .celebration-icon { font-size: 36px; }
            .celebration-message { font-size: 18px; }
            .benefits-section { padding: 16px; }
            .cta-section { padding: 16px; }
            .footer-section { padding: 16px; }
        }
        
        @media (max-width: 360px) {
            .brand-logo { font-size: 20px; }
            .main-title { font-size: 15px; }
            .celebration-icon { font-size: 32px; }
            .celebration-message { font-size: 16px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header-section">
                <div class="brand-logo">Eternal Joyería</div>
                <h1 class="main-title">Welcome | Bienvenid@</h1>
                <p class="subtitle">Your Journey Begins | Tu Viaje Comienza</p>
            </div>
            
            <div class="content-section">
                <div class="welcome-message">
                    <div class="language-block">
                        <div class="language-label">English</div>
                        <div class="language-text">
                            Welcome to Eternal Joyería, <span class="name-highlight">${firstName}</span>! 
                            We're thrilled to have you join our community of jewelry lovers. Your account has been successfully verified and is now ready to use.
                        </div>
                    </div>
                    <div class="language-block">
                        <div class="language-label">Español</div>
                        <div class="language-text">
                            ¡Bienvenid@ a Eternal Joyería, <span class="name-highlight">${firstName}</span>! 
                            Estamos emocionados de tenerte en nuestra comunidad de amantes de la joyería. Tu cuenta ha sido verificada exitosamente y ya está lista para usar.
                        </div>
                    </div>
                </div>
                
                <div class="celebration-section">
                    <div class="celebration-container">
                        <div class="celebration-icon">✨💎✨</div>
                        <div class="celebration-text">Congratulations | Felicitaciones</div>
                        <div class="celebration-message">Account Active!</div>
                    </div>
                </div>
                
                <div class="benefits-section">
                    <div class="benefits-content">
                        <div class="benefits-label">English - What you can do now:</div>
                        <div class="benefits-list">
                            <ul>
                                <li>Browse our exclusive jewelry collections</li>
                                <li>Save your favorite pieces to your wishlist</li>
                                <li>Receive personalized recommendations</li>
                                <li>Get early access to sales and new arrivals</li>
                            </ul>
                        </div>
                    </div>
                    <div class="benefits-content">
                        <div class="benefits-label">Español - Lo que puedes hacer ahora:</div>
                        <div class="benefits-list">
                            <ul>
                                <li>Explorar nuestras colecciones exclusivas de joyería</li>
                                <li>Guardar tus piezas favoritas en tu lista de deseos</li>
                                <li>Recibir recomendaciones personalizadas</li>
                                <li>Acceso temprano a ofertas y nuevos productos</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    <div class="cta-content">
                        <div class="cta-label">English</div>
                        <div class="cta-text">
                            Ready to discover timeless elegance? Start exploring our collections now!
                        </div>
                    </div>
                    <div class="cta-content">
                        <div class="cta-label">Español</div>
                        <div class="cta-text">
                            ¿List@ para descubrir elegancia atemporal? ¡Comienza a explorar nuestras colecciones ahora!
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-section">
                <div class="support-info">
                    <div class="support-label">English</div>
                    <div class="support-text">
                        Questions? We're here to help! Contact us at 
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link">eternaljoyeria@gmail.com</a>
                    </div>
                </div>
                <div class="support-info">
                    <div class="support-label">Español</div>
                    <div class="support-text">
                        ¿Preguntas? ¡Estamos aquí para ayudarte! Contáctanos en 
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

export { sendEmail, HTMLWelcomeEmail };