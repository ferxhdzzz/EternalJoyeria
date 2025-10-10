// Archivo: RecoveryPassword.js
import fetch from "node-fetch";

//Aqui colocar la API KEY que obtuvieron de Brevo
const apiKey = process.env.brevoApiKey;

const RecoveryPassword = async function enviarCorreo(email, code) {
  console.log(' [RecoveryPassword] Iniciando envío de correo de recuperación');
  console.log(' [RecoveryPassword] Email destino:', email);
  console.log(' [RecoveryPassword] Código:', code);
  console.log(' [RecoveryPassword] API Key configurada:', apiKey ? 'SÍ ' : 'NO ');
  
  if (!apiKey) {
    console.error(' [RecoveryPassword] ERROR: Brevo API Key no está configurada');
    throw new Error('Brevo API Key no configurada');
  }
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Eternal Joyeria", email: "lovercotes@gmail.com" }, // Correo con el que crearon la cuenta de Brevo
      to: [{ email: email }],
      subject: "Recuperacion de Contraseña",
      htmlContent: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eternal Joyería - Password Recovery</title>
</head>
<body style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fef7f7, #fce7e7); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 15px;">
    <div class="email-container" style="width: 100%; max-width: 720px; margin: 0 auto;">
        <div class="email-card" style="background: white; border-radius: 20px; box-shadow: 0 20px 40px -12px rgba(251, 113, 133, 0.25); overflow: hidden; border: 1px solid rgba(251, 113, 133, 0.1);">
            
            <div class="header-section" style="background: linear-gradient(135deg, #fef7f7, #fce7e7); padding: 40px 30px 35px; text-align: center; border-top: 3px solid #f472b6;">
                <div class="brand-logo" style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #ec4899; margin-bottom: 12px;">
                    Eternal Joyería
                </div>
                <h1 class="main-title" style="font-size: 24px; font-weight: 600; color: #ec4899; margin-bottom: 6px;">
                    Password Recovery | Recuperación de Contraseña
                </h1>
                <p class="subtitle" style="font-size: 14px; color: #f472b6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
                    Secure Access | Acceso Seguro
                </p>
            </div>
            
            <div class="content-section" style="padding: 35px 30px;">
                <div class="welcome-message" style="background: #fef7f7; border-radius: 16px; padding: 28px; margin-bottom: 35px; border: 1px solid rgba(251, 113, 133, 0.1);">
                    <div class="language-block" style="margin-bottom: 16px;">
                        <div class="language-label" style="font-weight: 600; color: #ec4899; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                            English
                        </div>
                        <div class="language-text" style="color: #6b7280; line-height: 1.6; font-size: 16px;">
                            Hello! We received a request to reset your password. Use the verification code below to proceed with your account recovery.
                        </div>
                    </div>
                    <div class="language-block" style="margin-bottom: 0;">
                        <div class="language-label" style="font-weight: 600; color: #ec4899; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                            Español
                        </div>
                        <div class="language-text" style="color: #6b7280; line-height: 1.6; font-size: 16px;">
                            ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña. Usa el código de verificación a continuación para continuar con la recuperación de tu cuenta.
                        </div>
                    </div>
                </div>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0;">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f472b6, #ec4899); background-color: #ec4899; border-radius: 20px; max-width: 300px; width: 100%;">
                                <tr>
                                    <td style="padding: 32px 28px; text-align: center;">
                                        <div style="color: rgba(255, 255, 255, 0.9); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; text-align: center;">
                                            Verification Code | Código de Verificación
                                        </div>
                                        <div style="font-size: 36px; font-weight: 700; color: #ffffff; font-family: 'Courier New', Courier, monospace; letter-spacing: 5px; text-align: center; margin: 0; padding: 0; line-height: 1.2;">
                                            ${code}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <div class="timer-section" style="background: linear-gradient(135deg, #fef3f3, #fce7e7); border-radius: 16px; padding: 24px; margin: 35px 0; border-left: 3px solid #fb7185;">
                    <div class="timer-content" style="margin-bottom: 14px;">
                        <div class="timer-label" style="font-weight: 600; color: #e11d48; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                            English
                        </div>
                        <div class="timer-text" style="color: #be123c; line-height: 1.6; font-size: 15px;">
                            This code is valid for the next <strong>15 minutes</strong>. If you didn't request this email, you can safely ignore it.
                        </div>
                    </div>
                    <div class="timer-content" style="margin-bottom: 0;">
                        <div class="timer-label" style="font-weight: 600; color: #e11d48; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                            Español
                        </div>
                        <div class="timer-text" style="color: #be123c; line-height: 1.6; font-size: 15px;">
                            Este código es válido por los próximos <strong>15 minutos</strong>. Si no solicitaste este correo, puedes ignorarlo de forma segura.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-section" style="background: #fef7f7; padding: 28px; text-align: center; border-top: 1px solid rgba(251, 113, 133, 0.1);">
                <div class="support-info" style="margin-bottom: 14px;">
                    <div class="support-label" style="font-weight: 600; color: #ec4899; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                        English
                    </div>
                    <div class="support-text" style="color: #6b7280; font-size: 15px; line-height: 1.6;">
                        If you need further assistance, please contact our support team at
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link" style="color: #f472b6; text-decoration: none; font-weight: 600;">eternaljoyeria@gmail.com</a>
                    </div>
                </div>
                <div class="support-info" style="margin-bottom: 0;">
                    <div class="support-label" style="font-weight: 600; color: #ec4899; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                        Español
                    </div>
                    <div class="support-text" style="color: #6b7280; font-size: 15px; line-height: 1.6;">
                        Si necesitas asistencia adicional, por favor contacta a nuestro equipo de soporte en
                        <a href="mailto:eternaljoyeria@gmail.com" class="support-link" style="color: #f472b6; text-decoration: none; font-weight: 600;">eternaljoyeria@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    }),
  });

  console.log('📧 [RecoveryPassword] Respuesta de Brevo - Status:', response.status);
  console.log('📧 [RecoveryPassword] Respuesta de Brevo - OK:', response.ok);
  
  const data = await response.json();
  console.log('📧 [RecoveryPassword] Datos de respuesta:', data);
  
  if (!response.ok) {
    console.error('❌ [RecoveryPassword] ERROR al enviar correo:', data);
    throw new Error(`Error de Brevo: ${data.message || 'Error desconocido'}`);
  }
  
  console.log('✅ [RecoveryPassword] Correo enviado exitosamente');
  return data;
};

export default RecoveryPassword;