// Archivo: src/hooks/Ajustes/useDataAjustes.js

// IMPORTA LOS HOOKS Y LIBRERÍA DE TOAST
import { useState } from "react";
import { toast } from "react-toastify";

// DEFINICIÓN DEL HOOK PERSONALIZADO PARA MANEJAR DATOS DE AJUSTES
const useDataAjustes = () => {
  // ESTADO PARA CONTROLAR LA CARGA DE IMÁGENES
  const [uploading, setUploading] = useState(false);

  // FUNCIÓN PARA SUBIR UNA IMAGEN A CLOUDINARY
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload_preset_eternaljoyeria");

      const response = await fetch("https://api.cloudinary.com/v1_1/dosy4rouu/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("RESPUESTA DE CLOUDINARY:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      return data.secure_url;
    } catch (error) {
      toast.error("Error al subir la imagen: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // FUNCIÓN PARA ACTUALIZAR DATOS DEL ADMINISTRADOR
  const updateAdmin = async (data) => {
    try {
      let options;

      // ❌ ELIMINAMOS LA LÓGICA DE FORMDATA AQUÍ ❌
      // Razón: Tu componente ProfileCard siempre llama a updateAdmin con JSON,
      // ya sea solo con name/email O con name/email/profilePicture (la URL ya subida).
      // El bloque 'if (data.file)' no se usa correctamente en tu flujo.
      // Simplificamos para que siempre envíe JSON, que es lo que espera el backend
      // cuando se envía un perfil que no es un registro inicial.

      // ENVIAR JSON NORMAL
      options = {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password, // Puede ser undefined
          profilePicture: data.profilePicture, // Puede ser undefined o la URL
        }),
      };
      // Note: Si el backend espera un campo 'file' o un comportamiento diferente
      // cuando no se envía la foto, deberás ajustar el 'body' aquí.
      // Pero para Name/Email y ProfilePicture (URL), el JSON es el método más limpio.

      // ENVIAR LA SOLICITUD AL SERVIDOR
      const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/admins/me", options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar perfil");
      }

      // MOSTRAR TOAST DE ÉXITO
      toast.success("Perfil actualizado correctamente");

      // Corregido: Usamos result.user para consistencia
      localStorage.setItem("adminName", result.user.name);
      localStorage.setItem("adminImage", result.user.profilePicture);

      // RETORNAR ADMIN ACTUALIZADO (el objeto de administrador)
      return result.user;
    } catch (error) {
      toast.error(error.message || "Error al actualizar");
      return null;
    }
  };

  // RETORNO DE FUNCIONES Y ESTADO DEL HOOK
  return {
    uploadImage,
    updateAdmin,
    uploading,
  };
};

// EXPORTA EL HOOK PARA USO EN OTROS COMPONENTES
export default useDataAjustes;