import { useState } from "react";
import { toast } from "react-toastify";

const useDataAjustes = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upload_preset_eternaljoyeria");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dosy4rouu/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Error al subir imagen");
      }

      return data.secure_url;
    } catch (error) {
      toast.error("Error al subir la imagen: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const updateAdmin = async (data) => {
    try {
      let options = {
        method: "PUT",
        credentials: "include", // para enviar cookies (sesión)
      };

      // Si data contiene 'file' (imagen), usamos FormData
      if (data.file) {
        const formData = new FormData();
        if (data.nombre) formData.append("name", data.nombre);
        if (data.correo) formData.append("email", data.correo);
        if (data.password) formData.append("password", data.password);
        formData.append("profilePicture", data.file);
        options.body = formData;
        // No pongas headers, fetch los setea automáticamente
      } else {
        // Enviar JSON si no hay imagen
        options.headers = { "Content-Type": "application/json" };
        // Asegúrate de mapear keys a lo que espera el backend
        options.body = JSON.stringify({
          name: data.nombre,
          email: data.correo,
          password: data.password,
        });
      }

      const res = await fetch("http://localhost:4000/api/admins/me", options);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar perfil");
      }

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error(error.message || "Error al actualizar");
    }
  };

  return {
    uploadImage,
    updateAdmin,
    uploading,
  };
};

export default useDataAjustes;
