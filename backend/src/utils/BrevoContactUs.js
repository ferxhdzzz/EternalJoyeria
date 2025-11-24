import fetch from "node-fetch";

// Aquí debería ir la API KEY de Brevo, preferiblemente desde las variables de entorno
const apiKey = process.env.brevoApiKey;
const adminEmail = "lovercotes@gmail.com"; // 💡 CORREO VERIFICADO EN BREVO (TÚ/REMITENTE)
const recipientEmail = "eternaljoyeriadeflores@gmail.com"; // 💡 CORREO DEL ADMINISTRADOR (DESTINATARIO)

/**
 * Función para generar HTML del email de contacto (CON CSS EN LÍNEA y TABLAS)
 *
 * @param {string} fullName - Nombre completo del remitente.
 * @param {string} email - Correo del remitente.
 * @param {string} phone - Teléfono del remitente (opcional).
 * @param {string} subject - Asunto del mensaje.
 * @param {string} message - Contenido del mensaje.
 * @returns {string} - El contenido HTML del correo.
 */
const HTMLContactusEmail = (fullName, email, phone, subject, message) => {
    // Generación de fecha para el sello de tiempo
    const currentDate = new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Aseguramos los saltos de línea con <br/>
    const messageContent = message.replace(/\n/g, '<br/>').replace(/\r/g, '');

    // 💡 PLANTILLA HTML CONVERTIDA A CSS EN LÍNEA Y ESTRUCTURA DE TABLA
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Eternal Joyería - Nuevo Mensaje de Contacto</title>
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
                        Nuevo Mensaje de Contacto
                    </div>
                    <p style="font-size: 13px; color: #4ade80; text-transform: uppercase; margin-top: 6px; margin-bottom: 0;">
                        Formulario Web | Contact Form
                    </p>
                </div>

                <div style="padding: 35px 40px;">
                    
                    <div style="background: #f0fdf4; padding: 25px; border-radius: 14px; margin-bottom: 25px; border: 1px solid #d1fae5;">
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                            <tr>
                                <td width="120" style="font-weight: 600; color: #16a34a; font-size: 14px; padding-bottom: 4px; vertical-align: top;">Nombre completo:</td>
                                <td style="color: #374151; font-size: 14px; padding-bottom: 4px; word-break: break-word; vertical-align: top;">${fullName}</td>
                            </tr>
                        </table>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                            <tr>
                                <td width="120" style="font-weight: 600; color: #16a34a; font-size: 14px; padding-bottom: 4px; vertical-align: top;">Email:</td>
                                <td style="color: #374151; font-size: 14px; padding-bottom: 4px; word-break: break-word; vertical-align: top;">${email}</td>
                            </tr>
                        </table>

                        ${phone ? `
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                            <tr>
                                <td width="120" style="font-weight: 600; color: #16a34a; font-size: 14px; padding-bottom: 4px; vertical-align: top;">Teléfono:</td>
                                <td style="color: #374151; font-size: 14px; padding-bottom: 4px; word-break: break-word; vertical-align: top;">${phone}</td>
                            </tr>
                        </table>
                        ` : ''}

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td width="120" style="font-weight: 600; color: #16a34a; font-size: 14px; vertical-align: top;">Asunto:</td>
                                <td style="color: #374151; font-size: 14px; word-break: break-word; vertical-align: top;">${subject}</td>
                            </tr>
                        </table>

                    </div>
                    
                    <div style="background: #fdf4f9; border-radius: 16px; padding: 28px; border: 1px solid #f3d4e8; margin-top: 20px;">
                        <div style="font-size: 13px; color: #9d174d; font-weight: 600; text-transform: uppercase; margin-bottom: 15px;">
                            Mensaje del Cliente
                        </div>
                        <div style="color: #374151; font-size: 15px; line-height: 1.7; background: white; padding: 20px; border-radius: 12px; border: 1px solid #f3d4e8;">
                            ${messageContent}
                        </div>
                    </div>
                    
                    <div style="background: #fefce8; padding: 20px; border-radius: 12px; border-left: 4px solid #facc15; margin-top: 20px;">
                        <div style="font-size: 12px; color: #ca8a04; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">
                            Fecha y Hora
                        </div>
                        <div style="color: #78350f; font-size: 14px;">
                            Recibido el ${currentDate}
                        </div>
                    </div>
                </div>

                <div style="padding: 25px 20px; text-align: center; background: #f9fafb; border-top: 1px solid #d1fae5;">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                        Responde directamente a este email: <a href="mailto:${email}" style="color: #22c55e; font-weight: 600; text-decoration: none;">${email}</a>
                    </div>
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
                        Este mensaje fue enviado desde el formulario de contacto de eternal-joyeria-sigma.vercel.app
                    </div>
                </div>
            </td>
        </tr>
    </table>
</center>
</body>
</html>`;
};


/**
 * Función principal para enviar el correo de contacto usando la API de Brevo.
 * (Se mantiene sin cambios)
 * * @param {string} fullName - Nombre completo del usuario.
 * @param {string} email - Correo del usuario.
 * @param {string} phone - Teléfono del usuario (puede ser null/undefined).
 * @param {string} subject - Asunto del mensaje.
 * @param {string} message - Contenido del mensaje.
 */
const sendContactEmail = async (fullName, email, phone, subject, message) => {
    if (!apiKey) {
        console.error("Brevo API Key no definida. No se puede enviar el correo de contacto.");
        return { success: false, message: "Error de configuración: API Key no definida." };
    }

    // Llama a la nueva plantilla con CSS en línea
    const htmlContent = HTMLContactusEmail(fullName, email, phone, subject, message);
    
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                // El remitente (FROM) debe ser tu correo verificado en Brevo
                sender: { name: "Eternal Joyeria Contacto", email: adminEmail },
                
                // El destinatario (TO) es tu correo de administrador
                to: [{ email: recipientEmail, name: "Administrador" }],
                
                // El asunto incluye el que proporcionó el usuario
                subject: `Nuevo Mensaje: ${subject}`,
                
                htmlContent: htmlContent,
                
                // Permite responder directamente al email del usuario que contactó
                replyTo: { email: email, name: fullName }
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: "Correo de contacto enviado exitosamente." };
        } else {
            console.error("Error al enviar correo de contacto (Brevo):", data);
            return { success: false, message: "Error del servicio Brevo.", data };
        }
    } catch (error) {
        console.error("Error en la función sendContactEmail:", error);
        return { success: false, message: "Error interno del servidor.", error };
    }
};

// 💡 Exporta la función principal para usarla en tu controlador
export { sendContactEmail };