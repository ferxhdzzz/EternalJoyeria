// 📁 controllers/contactusController.js

import { sendMail, HTMLContactusEmail } from "../utils/email.js";
import { config } from "../config.js";

const contactusController = {};

// ===== UTILIDADES DE VALIDACIÓN =====

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
  if (!phone || phone.trim() === "") return true; // Teléfono es opcional
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

// ===== FUNCIÓN PRINCIPAL =====

/**
 * 🚀 ENVIAR MENSAJE DE CONTACTO
 * Procesa el formulario de contacto y envía email al administrador
 */
contactusController.sendContactMessage = async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  try {
    // ===== VALIDACIONES DE ENTRADA =====
    
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

    // Validar nombre completo (mínimo 2 caracteres)
    if (!validateText(fullNameTrimmed, 2)) {
      return res.status(400).json({ 
        message: "El nombre completo debe tener al menos 2 caracteres." 
      });
    }

    // Validar formato de email
    if (!validateEmail(emailTrimmed)) {
      return res.status(400).json({ 
        message: "Formato de email inválido." 
      });
    }

    // Validar asunto (mínimo 3 caracteres)
    if (!validateText(subjectTrimmed, 3)) {
      return res.status(400).json({ 
        message: "El asunto debe tener al menos 3 caracteres." 
      });
    }

    // Validar mensaje (mínimo 10 caracteres)
    if (!validateText(messageTrimmed, 10)) {
      return res.status(400).json({ 
        message: "El mensaje debe tener al menos 10 caracteres." 
      });
    }

    // Validar teléfono si se proporciona
    if (phoneTrimmed && !validatePhone(phoneTrimmed)) {
      return res.status(400).json({ 
        message: "Formato de teléfono inválido." 
      });
    }

    // Validar longitud máxima para evitar spam
    if (fullNameTrimmed.length > 100) {
      return res.status(400).json({ 
        message: "El nombre es demasiado largo (máximo 100 caracteres)." 
      });
    }

    if (subjectTrimmed.length > 200) {
      return res.status(400).json({ 
        message: "El asunto es demasiado largo (máximo 200 caracteres)." 
      });
    }

    if (messageTrimmed.length > 2000) {
      return res.status(400).json({ 
        message: "El mensaje es demasiado largo (máximo 2000 caracteres)." 
      });
    }

    // ===== CONFIGURAR EMAIL DEL ADMINISTRADOR =====
    
    // Email del administrador (usa el mismo email configurado en smtp)
    const adminEmail = config.smtp.user || "tomasgaldames91@gmail.com"; // Fallback por seguridad
    
    // Crear asunto personalizado para el email
    const emailSubject = `[CONTACTO WEB] ${subjectTrimmed}`;
    
    // Mensaje de texto plano como fallback
    const textMessage = `
NUEVO MENSAJE DE CONTACTO

Nombre: ${fullNameTrimmed}
Email: ${emailTrimmed}
${phoneTrimmed ? `Teléfono: ${phoneTrimmed}` : ''}
Asunto: ${subjectTrimmed}

Mensaje:
${messageTrimmed}

---
Enviado desde el formulario de contacto web
Fecha: ${new Date().toLocaleString('es-ES')}
    `.trim();

    // ===== ENVIAR EMAIL AL ADMINISTRADOR =====
    try {
      await sendMail(
        adminEmail,
        emailSubject,
        textMessage,
        HTMLContactusEmail(fullNameTrimmed, emailTrimmed, phoneTrimmed, subjectTrimmed, messageTrimmed)
      );

      // Log para seguimiento (solo en desarrollo)
      if (process.env.NODE_ENV !== "production") {
        console.log("Contact message sent successfully:", {
          from: emailTrimmed,
          name: fullNameTrimmed,
          subject: subjectTrimmed,
          timestamp: new Date().toISOString()
        });
      }

    } catch (emailError) {
      console.error("Error sending contact email:", emailError);
      return res.status(500).json({ 
        message: "Error al enviar el mensaje. Por favor intenta nuevamente más tarde." 
      });
    }

    // ===== RESPUESTA EXITOSA =====
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