// IMPORTA TOAST Y LOS HOOKS DE REACT
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

// URL DE LA API DE CATEGORÍAS
const api = "https://eternaljoyeria-cg5d.onrender.com/api/categories";

// DEFINICIÓN DEL HOOK PERSONALIZADO
const useFetchCategorias = () => {
  // ESTADO QUE ALMACENA TODAS LAS CATEGORÍAS
  const [categories, setCategories] = useState([]);

  // FUNCIÓN PARA OBTENER TODAS LAS CATEGORÍAS
  const getCategories = async () => {
    try {
      const response = await fetch(api, {
        credentials: "include", // INCLUYE COOKIES PARA SESIONES AUTENTICADAS
      });

      if (!response.ok) throw new Error("Error fetching categories");

      const data = await response.json();
      console.log("DATA FROM API:", data);

      // ACTUALIZA EL ESTADO CON LAS CATEGORÍAS
      setCategories(data.categories);
    } catch (error) {
      console.error("ERROR FETCHING CATEGORIES:", error);
      toast.error("Error al obtener las categorías");
    }
  };

  // FUNCIÓN PARA OBTENER UNA CATEGORÍA POR SU ID
  const getCategorieById = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        credentials: "include", // ENVÍA COOKIES EN LA SOLICITUD
      });

      if (!response.ok) throw new Error("Failed to fetch category");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("ERROR FETCHING CATEGORY:", error);
      return null;
    }
  };

  // LLAMA A getCategories CUANDO SE MONTA EL COMPONENTE
  useEffect(() => {
    getCategories();
  }, []);

  // EXPORTA LAS FUNCIONES Y DATOS QUE OTORGA ESTE HOOK
  return {
    categories,
    getCategorieById,
    getCategories,
  };
};

// EXPORTA EL HOOK PARA SU USO EN COMPONENTES
export default useFetchCategorias;
