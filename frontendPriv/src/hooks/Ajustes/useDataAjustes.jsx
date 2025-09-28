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

      // SI SE PROPORCIONA UN ARCHIVO, USAR FORMDATA
      if (data.file) {
        const formData = new FormData();

        // VALIDAR CAMPOS OBLIGATORIOS
        if (!data.name || !data.email) {
          throw new Error("El nombre y el correo son obligatorios");
        }

        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.password) formData.append("password", data.password);
        formData.append("profilePicture", data.file);

        console.log("ENVIANDO FORMDATA CON:", [...formData.entries()]);

        options = {
          method: "PUT",
          credentials: "include",
          body: formData,
        };
      } else {
        // EN CASO CONTRARIO, ENVIAR JSON NORMAL
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

      // ENVIAR LA SOLICITUD AL SERVIDOR
      const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/admins/me", options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar perfil");
      }

      // MOSTRAR TOAST DE ÉXITO
      toast.success("Perfil actualizado correctamente");

      // GUARDAR DATOS EN LOCALSTORAGE
      localStorage.setItem("adminName", result.admin.name);
      localStorage.setItem("adminImage", result.admin.profilePicture);

      // RETORNAR ADMIN ACTUALIZADO
      return result.admin;
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
