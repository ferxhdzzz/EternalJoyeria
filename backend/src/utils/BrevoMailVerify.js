import fetch from "node-fetch";
 
//Aqui colocar la API KEY que obtuvieron de Brevo
const apiKey = process.env.brevoApiKey;
 
const MailVerify = async function enviarCorreo(email, code) {
  console.log('📧 [MailVerify] Iniciando envío de correo de verificación');
  console.log('📧 [MailVerify] Email destino:', email);
  console.log('📧 [MailVerify] Código:', code);
  console.log('📧 [MailVerify] API Key configurada:', apiKey ? 'SÍ ✅' : 'NO ❌');
  
  if (!apiKey) {
    console.error("❌ [MailVerify] ERROR: Brevo API Key no definida. No se puede enviar el correo de verificación.");
    return { success: false, message: "Error de configuración: API Key no definida." };
  }
 
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Eternal Joyería - Verificación</title>
</head>
<body style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); min-height: 100vh; padding: 20px;">
<center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(22, 163, 74, 0.1); overflow: hidden; border: 1px solid #bbf7d0;">
        <tr>
            <td align="center">
                <div style="background: #ecfdf5; padding: 40px 30px; text-align: center; border-bottom: 1px solid #d1fae5;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #16a34a; margin-bottom: 10px;">
                        Eternal Joyería
                    </div>
                    <div style="font-size: 20px; color: #166534; font-weight: 600;">
                        Email Verification | Verificación de Email
                    </div>
                    <p style="font-size: 13px; color: #4ade80; text-transform: uppercase; margin-top: 6px; margin-bottom: 0;">
                        Secure Registration | Registro Seguro
                    </p>
                </div>

                <div style="padding: 35px 40px;">
                    <div style="background: #f0fdf4; padding: 25px; border-radius: 14px; margin-bottom: 30px; border: 1px solid #d1fae5;">
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 12px; color: #16a34a; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">English</div>
                            <div style="color: #374151; font-size: 15px; line-height: 1.6;">
                                Thank you for registering! Use the verification code below to confirm your email address.
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #16a34a; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Español</div>
                            <div style="color: #374151; font-size: 15px; line-height: 1.6;">
                                ¡Gracias por registrarte! Usa el código de verificación a continuación para confirmar tu dirección de email.
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <div style="background: #fdf4f9; border-radius: 16px; padding: 28px; box-shadow: 0 8px 24px rgba(214, 150, 191, 0.3); border: 1px solid #f3d4e8;">
                            <div style="font-size: 13px; color: #9d174d; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">Verification Code | Código de Verificación</div>
                            <div style="font-size: 36px; color: #D696BF; font-weight: 700; letter-spacing: 6px; font-family: 'Inter', monospace; text-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                ${code}
                            </div>
                        </div>
                    </div>

                    <div style="background: #fefce8; padding: 24px; border-radius: 12px; border-left: 4px solid #facc15; margin-top: 20px;">
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 12px; color: #ca8a04; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">English</div>
                            <div style="color: #78350f; font-size: 14px; line-height: 1.5;">This code will expire in <strong style="font-weight: 700;">2 Hours</strong>. If you didn't sign up, you can ignore this email.</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #ca8a04; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Español</div>
                            <div style="color: #78350f; font-size: 14px; line-height: 1.5;">Este código expirará en <strong style="font-weight: 700;">2 Horas</strong>. Si no te registraste, puedes ignorar este email.</div>
                        </div>
                    </div>
                </div>

                <div style="padding: 25px 20px; text-align: center; background: #f9fafb; border-top: 1px solid #d1fae5;">
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; color: #16a34a; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">English</div>
                        <div style="font-size: 14px; color: #374151;">
                            Need help? Contact us at <a href="mailto:eternaljoyeria@gmail.com" style="color: #22c55e; font-weight: 600; text-decoration: none;">eternaljoyeria@gmail.com</a>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #16a34a; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Español</div>
                        <div style="font-size: 14px; color: #374151;">
                            ¿Necesitas ayuda? Contáctanos en <a href="mailto:eternaljoyeria@gmail.com" style="color: #22c55e; font-weight: 600; text-decoration: none;">eternaljoyeria@gmail.com</a>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</center>
</body>
</html>`;
 
   
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Eternal Joyeria", email: "lovercotes@gmail.com" }, //Aqui el correo con el que crearon la cuenta de Brevo
        to: [{ email: email }],
        subject: "Confirmacion de cuenta",
        htmlContent: htmlContent,
      }),
    });
 
    console.log('📧 [MailVerify] Respuesta de Brevo - Status:', response.status);
    console.log('📧 [MailVerify] Respuesta de Brevo - OK:', response.ok);
    
    const data = await response.json();
    console.log('📧 [MailVerify] Datos de respuesta:', data);

    if (response.ok) {
        console.log('✅ [MailVerify] Correo de verificación enviado exitosamente');
        return { success: true, message: "Correo de verificación enviado exitosamente." };
    } else {
        console.error("❌ [MailVerify] ERROR al enviar correo de verificación (Brevo):", data);
        return { success: false, message: "Error del servicio Brevo.", data };
    }

  } catch (error) {
    console.error("❌ [MailVerify] ERROR en la función MailVerify:", error);
    return { success: false, message: "Error interno del servidor.", error };
  }
};
 
export default MailVerify;
