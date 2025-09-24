// frontendPriv/src/hooks/Categorias/useDataCategorias.js
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Construye la URL base con fallback
const getApiBase = () => {
  const raw = import.meta?.env?.VITE_API_URL;
  const base =
    raw && typeof raw === "string" && raw.trim().length > 0
      ? raw.trim().replace(/\/+$/, "")
      : "http://localhost:4000/api";
  return `${base}/categories`;
};

const useDataCategorias = ({ reset, onSuccess } = {}) => {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const api = getApiBase();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        headers: { "Content-Type": "application/json" },
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

  // 👇 NUEVO: eliminar categoría
  const deleteCategorieById = async (id) => {
    try {
      const res = await fetch(`${api}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("No tienes permisos para eliminar categorías.");
        return false;
      }

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.message || "Error al eliminar categoría";
        throw new Error(msg);
      }

      toast.success("Categoría eliminada");
      await getCategories();
      return true;
    } catch (error) {
      toast.error(error.message || "Error al eliminar categoría");
      return false;
    }
  };

  return {
    categories,
    uploading,
    getCategories,
    uploadImage,
    editCategorieById,
    saveCategorieForm,
    deleteCategorieById, // 👈 exportado
  };
};

export default useDataCategorias;
