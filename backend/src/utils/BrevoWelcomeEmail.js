// Archivo: welcomeEmail.js

import fetch from "node-fetch";
 
// Aqui colocar la API KEY que obtuvieron de Brevo
const apiKey = process.env.brevoApiKey;
 
const welcomeEmail = async function enviarCorreo(email, firstName) {
 if (!apiKey) {
 console.error("Brevo API Key no definida. No se puede enviar el correo de bienvenida.");
 return { success: false, message: "Error de configuración: API Key no definida." };
}

 // 💡 Tu HTML se conserva tal cual, ya que es compatible con Email (CSS en línea y Tablas)
 const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Eternal Joyería - Welcome</title>
</head>
<body style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #faf5ff, #f3e8ff); min-height: 100vh; padding: 30px;">
<center>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px -12px rgba(147, 51, 234, 0.25); overflow: hidden; border: 1px solid rgba(147, 51, 234, 0.1);">
    <tr>
      <td align="center">
                <div style="background: linear-gradient(135deg, #faf5ff, #f3e8ff); padding: 40px 30px 35px; text-align: center; border-top: 3px solid #9333ea;">
          <div style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #7c3aed; margin-bottom: 10px;">
            Eternal Joyería
          </div>
          <h1 style="font-size: 24px; font-weight: 600; color: #7c3aed; margin-bottom: 6px;">
            Welcome | Bienvenid@
          </h1>
          <p style="font-size: 14px; color: #9333ea; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">
            Your Journey Begins | Tu Viaje Comienza
          </p>
        </div>
 
                <div style="padding: 35px 30px;">
          <div style="background: #faf5ff; border-radius: 12px; padding: 28px; margin-bottom: 35px; border: 1px solid rgba(147, 51, 234, 0.1);">
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; color: #7c3aed; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">English</div>
              <div style="color: #6b7280; line-height: 1.6; font-size: 16px;">
                Welcome to Eternal Joyería, <span style="color: #7c3aed; font-weight: 600;">${firstName}</span>!
                We're thrilled to have you join our community of jewelry lovers. Your account has been successfully verified and is now ready to use.
              </div>
            </div>
            <div style="margin-bottom: 0;">
              <div style="font-weight: 600; color: #7c3aed; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Español</div>
              <div style="color: #6b7280; line-height: 1.6; font-size: 16px;">
                ¡Bienvenid@ a Eternal Joyería, <span style="color: #7c3aed; font-weight: 600;">${firstName}</span>!
                Estamos emocionados de tenerte en nuestra comunidad de amantes de la joyería. Tu cuenta ha sido verificada exitosamente y ya está lista para usar.
              </div>
            </div>
          </div>
 
                    <div style="text-align: center; margin: 35px 0;">
            <div style="background: linear-gradient(135deg, #9333ea, #7c3aed); border-radius: 16px; padding: 30px 25px; box-shadow: 0 15px 30px -8px rgba(147, 51, 234, 0.4); display: inline-block;">
              <div style="font-size: 48px; margin-bottom: 16px; color: white;">✨</div>
              <div style="color: rgba(255, 255, 255, 0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
                Congratulations | Felicitaciones
              </div>
              <div style="font-size: 26px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); margin: 0;">
                Account Active!
              </div>
            </div>
          </div>
 
                    <div style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); border-radius: 12px; padding: 28px; margin: 35px 0; border-left: 3px solid #c084fc;">
            <div style="margin-bottom: 18px;">
              <div style="font-weight: 600; color: #86198f; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">English - What you can do now:</div>
              <div style="color: #701a75; line-height: 1.6; font-size: 15px;">
                <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                  <li style="margin-bottom: 6px;">Browse our exclusive jewelry collections</li>
                  <li style="margin-bottom: 6px;">Save your favorite pieces to your wishlist</li>
                  <li style="margin-bottom: 6px;">Receive personalized recommendations</li>
                  <li style="margin-bottom: 0;">Get early access to sales and new arrivals</li>
                </ul>
              </div>
            </div>
            <div style="margin-bottom: 0;">
              <div style="font-weight: 600; color: #86198f; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Español - Lo que puedes hacer ahora:</div>
              <div style="color: #701a75; line-height: 1.6; font-size: 15px;">
                <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                  <li style="margin-bottom: 6px;">Explorar nuestras colecciones exclusivas de joyería</li>
                  <li style="margin-bottom: 6px;">Guardar tus piezas favoritas en tu lista de deseos</li>
                  <li style="margin-bottom: 6px;">Recibir recomendaciones personalizadas</li>
                  <li style="margin-bottom: 0;">Acceso temprano a ofertas y nuevos productos</li>
                </ul>
              </div>
            </div>
          </div>
 
                    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; padding: 28px; margin: 35px 0; text-align: center; border: 1px solid rgba(34, 197, 94, 0.1);">
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; color: #16a34a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">English</div>
              <div style="color: #15803d; line-height: 1.5; font-size: 16px; font-weight: 500;">
                Ready to discover timeless elegance? <a href="[LINK_TO_STORE]" style="color: #22c55e; text-decoration: none; font-weight: 700;">Start exploring our collections now!</a>
              </div>
            </div>
            <div style="margin-bottom: 0;">
              <div style="font-weight: 600; color: #16a34a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Español</div>
              <div style="color: #15803d; line-height: 1.5; font-size: 16px; font-weight: 500;">
                ¿List@ para descubrir elegancia atemporal? <a href="[LINK_TO_STORE]" style="color: #22c55e; text-decoration: none; font-weight: 700;">¡Comienza a explorar nuestras colecciones ahora!</a>
              </div>
            </div>
          </div>
        </div>
 
                <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid rgba(147, 51, 234, 0.1);">
          <div style="margin-bottom: 14px;">
            <div style="font-weight: 600; color: #7c3aed; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">English</div>
            <div style="color: #6b7280; font-size: 15px; line-height: 1.5;">
              Questions? We're here to help! Contact us at
              <a href="mailto:eternaljoyeria@gmail.com" style="color: #9333ea; text-decoration: none; font-weight: 600;">eternaljoyeria@gmail.com</a>
            </div>
          </div>
          <div style="margin-bottom: 0;">
            <div style="font-weight: 600; color: #7c3aed; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Español</div>
            <div style="color: #6b7280; font-size: 15px; line-height: 1.5;">
              ¿Preguntas? ¡Estamos aquí para ayudarte! Contáctanos en
              <a href="mailto:eternaljoyeria@gmail.com" style="color: #9333ea; text-decoration: none; font-weight: 600;">eternaljoyeria@gmail.com</a>
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
                sender: { name: "Eternal Joyeria", email: "lovercotes@gmail.com" }, // Correo con el que crearon la cuenta de Brevo
                to: [{ email: email}],
                subject: "Bienvenid@ a Eternal Joyeria",
                htmlContent: htmlContent, // Usamos la variable con el HTML compatible
            }),
        });
 
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            return { success: true, message: "Correo de bienvenida enviado exitosamente." };
        } else {
            console.error("Error al enviar correo de bienvenida (Brevo):", data);
            return { success: false, message: "Error del servicio Brevo.", data };
        }

    } catch (error) {
        console.error("Error en la función welcomeEmail:", error);
        return { success: false, message: "Error interno del servidor.", error };
    }
};
 
export default welcomeEmail;
