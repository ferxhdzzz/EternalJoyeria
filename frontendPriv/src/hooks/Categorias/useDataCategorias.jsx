import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const api = "https://eternaljoyeria-cg5d.onrender.com/api/categories";

const useDataCategorias = ({ reset, onSuccess } = {}) => {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const getCategories = async () => {
    try {
      const res = await fetch(api, { credentials: "include" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        toast.error("La respuesta del servidor no es válida.");
        setCategories([]);
      }
    } catch (error) {
      toast.error("Error al obtener categorías: " + error.message);
      setCategories([]);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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
      await getCategories();
    } catch (error) {
      toast.error("Error al editar categoría");
    } finally {
      if (reset) reset();
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
      if (onSuccess) onSuccess();
      await getCategories();
    } catch (error) {
      toast.error("Error al guardar categoría");
    } finally {
      if (reset) reset();
    }
  };

  return {
    categories,
    uploading,
    getCategories,
    uploadImage,
    editCategorieById,
    saveCategorieForm,
  };
};

export default useDataCategorias;
