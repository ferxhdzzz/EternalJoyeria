// 📁 controllers/contactusController.js

// 🚀 CAMBIO: Ahora importamos solo la función principal de envío de Brevo
import { sendContactEmail } from "../utils/BrevoContactUs.js"; 
import { config } from "../config.js"; 

const contactusController = {};

// ---------------------------------------------------------------------
// ===== UTILIDADES DE VALIDACIÓN =====
// ---------------------------------------------------------------------

/**
 * Valida formato de email usando expresión regular
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Valida formato de teléfono (opcional, formato flexible)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si el teléfono es válido o está vacío
 */
const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") return true;
  // Acepta números con guiones, espacios, paréntesis y el símbolo +
  return /^[\+]?[\d\s\-\(\)]{8,15}$/.test(phone.trim());
};

/**
 * Valida que el texto no esté vacío y tenga longitud mínima
 * @param {string} text - Texto a validar
 * @param {number} minLength - Longitud mínima requerida
 * @returns {boolean} - True si el texto es válido
 */
const validateText = (text, minLength = 1) => {
  return text && text.trim().length >= minLength;
};

// ---------------------------------------------------------------------
// ===== FUNCIÓN PRINCIPAL =====
// ---------------------------------------------------------------------

/**
 * 🚀 ENVIAR MENSAJE DE CONTACTO
 * Procesa el formulario de contacto y envía email al administrador
 */
contactusController.sendContactMessage = async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  try {
    // ===== VALIDACIONES DE ENTRADA (Sin cambios) =====
    
    // Verificar campos requeridos
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "Nombre completo, email, asunto y mensaje son requeridos." 
      });
    }

    // Normalizar datos
    const fullNameTrimmed = fullName.trim();
    const emailTrimmed = email.trim().toLowerCase();
    const subjectTrimmed = subject.trim();
    const messageTrimmed = message.trim();
    const phoneTrimmed = phone ? phone.trim() : "";

    // Validaciones de longitud y formato...
    if (!validateText(fullNameTrimmed, 2)) {
      return res.status(400).json({ message: "El nombre completo debe tener al menos 2 caracteres." });
    }
    if (!validateEmail(emailTrimmed)) {
      return res.status(400).json({ message: "Formato de email inválido." });
    }
    if (!validateText(subjectTrimmed, 3)) {
      return res.status(400).json({ message: "El asunto debe tener al menos 3 caracteres." });
    }
    if (!validateText(messageTrimmed, 10)) {
      return res.status(400).json({ message: "El mensaje debe tener al menos 10 caracteres." });
    }
    if (phoneTrimmed && !validatePhone(phoneTrimmed)) {
      return res.status(400).json({ message: "Formato de teléfono inválido." });
    }
    // Validaciones de longitud máxima...
    if (fullNameTrimmed.length > 100) {
      return res.status(400).json({ message: "El nombre es demasiado largo (máximo 100 caracteres)." });
    }
    if (subjectTrimmed.length > 200) {
      return res.status(400).json({ message: "El asunto es demasiado largo (máximo 200 caracteres)." });
    }
    if (messageTrimmed.length > 2000) {
      return res.status(400).json({ message: "El mensaje es demasiado largo (máximo 2000 caracteres)." });
    }

    // ⚠️ Se eliminó la lógica de 'adminEmail', 'emailSubject' y 'textMessage'
    // ya que todo se gestiona en la función 'sendContactEmail' de Brevo.

    // ===== ENVIAR EMAIL AL ADMINISTRADOR USANDO BREVO =====
    try {
        // 🚀 CAMBIO CLAVE: Llamada a la nueva función de Brevo
        const result = await sendContactEmail(
            fullNameTrimmed,
            emailTrimmed,
            phoneTrimmed,
            subjectTrimmed,
            messageTrimmed
        );

        // Manejar la respuesta del servicio de Brevo
        if (!result.success) {
            console.error("Error al enviar correo de contacto (Brevo):", result.error || result.data);
            return res.status(500).json({ 
                message: "Error al enviar el mensaje. Por favor intenta nuevamente más tarde." 
            });
        }

        // Log para seguimiento (solo en desarrollo)
        if (process.env.NODE_ENV !== "production") {
            console.log("Contact message sent successfully (Brevo):", {
                from: emailTrimmed,
                name: fullNameTrimmed,
                subject: subjectTrimmed,
                timestamp: new Date().toISOString()
            });
        }

    } catch (emailError) {
        console.error("Error llamando a sendContactEmail:", emailError);
        return res.status(500).json({ 
            message: "Error al enviar el mensaje. Por favor intenta nuevamente más tarde." 
        });
    }

    // ===== RESPUESTA EXITOSA (Sin cambios) =====
    res.status(200).json({ 
      message: "Mensaje enviado exitosamente. Te responderemos pronto." 
    });

  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ 
      message: "Error del servidor. Por favor intenta nuevamente más tarde." 
    });
  }
};

export default contactusController;