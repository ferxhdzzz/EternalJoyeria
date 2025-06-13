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
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Email Verification</h2>
      <p style="font-size: 16px; color: #333;">
        Thank you for registering! Use the verification code below to confirm your email address:
      </p>
      <div style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #3498db; color: white; font-size: 20px; font-weight: bold; border-radius: 5px;">
        ${code}
      </div>
      <p style="font-size: 14px; color: #555;">
        This code will expire in <strong>2 Hours</strong>. If you didn’t sign up, you can ignore this email.
      </p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
      <footer style="font-size: 12px; color: #aaa;">
        Need help? Contact us at 
        <a href="mailto:EternalJoyeria@gmail.com" style="color: #3498db;">support@example.com</a>
      </footer>
    </div>
  `;
};

export { sendMail, HTMLEmailVerification };
