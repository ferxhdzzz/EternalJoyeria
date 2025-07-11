import { useState } from "react";
import { toast } from "react-hot-toast";
import useFecthCategorias from "./useFecthCategorias";

const api = "http://localhost:4000/api/categories";

const useDataCategorie = ({ reset, onSuccess }) => {
  const { getCategories } = useFecthCategorias();
  const [uploading, setUploading] = useState(false);

 const uploadImage = async (file) => {
  try {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload_preset_eternaljoyeria");

    const response = await fetch("https://api.cloudinary.com/v1_1/dosy4rouu/upload", {
      method: "POST",
      credentials: "include",
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

  const editCategorieById = async (id, updatedData) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar");
      toast.success("Categoría actualizada con éxito");
      getCategories(); // refrescar categorías
    } catch (error) {
      console.error("Error al editar:", error);
      toast.error("Error al editar categoría");
    } finally {
      reset();
    }
  };

  const saveCategorieForm = async (dataForm) => {
    try {
      const response = await fetch(api, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      if (!response.ok) {
        toast.error("Error al guardar categoría");
        throw new Error("Failed to save category");
      }

      toast.success("Categoría guardada con éxito");
      if (onSuccess) onSuccess(); // para el sweet alert
      getCategories(); // ✅ actualizar sin refrescar
    } catch (error) {
      console.log("Error al guardar:", error);
    } finally {
      reset();
    }
  };

  return {
    uploadImage,
    editCategorieById,
    saveCategorieForm,
    uploading,
  };
};

export default useDataCategorie;
