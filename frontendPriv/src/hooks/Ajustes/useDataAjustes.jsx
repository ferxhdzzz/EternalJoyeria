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

    const response = await fetch("https://api.cloudinary.com/v1_1/dosy4rouu/upload", {
      method: "POST",



      body: formData,
    });

    const data = await response.json();
    console.log("Respuesta de Cloudinary:", data); // ✅ Agregá esto

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

  
const updateAdmin = async (data) => {
  try {
    let options;

    if (data.file) {
      const formData = new FormData();

      // Validar que los campos requeridos existen
      if (!data.name || !data.email) {
        throw new Error("El nombre y el correo son obligatorios");
      }

      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.password) formData.append("password", data.password);
      formData.append("profilePicture", data.file);

      console.log("🟡 Enviando FormData con:", [...formData.entries()]);

      options = {
        method: "PUT",
        credentials: "include",
        body: formData,
      };
    } else {
      options = {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          profilePicture: data.profilePicture,
        }),
      };
    }

    const response = await fetch("http://localhost:4000/api/admins/me", options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar perfil");
    }

    toast.success("Perfil actualizado correctamente");
    return result.admin;
  } catch (error) {
    toast.error(error.message || "Error al actualizar");
    return null;
  }

  
if (!response.ok) throw new Error(result.message || "Error al actualizar");

// Guarda en localStorage
localStorage.setItem("adminName", result.admin.name);
localStorage.setItem("adminImage", result.admin.profilePicture);
};


  return {
    uploadImage,
    updateAdmin,
    uploading,
  };
};

export default useDataAjustes;
