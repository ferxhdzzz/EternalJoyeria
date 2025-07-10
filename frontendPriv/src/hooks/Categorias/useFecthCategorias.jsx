import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const api = "http://localhost:4000/api/categories";

const useFecthCategorias = () => {
  const [categories, setCategories] = useState([]);

const getCategories = async () => {
  try {
    const response = await fetch(api);
    if (!response.ok) throw new Error("Error fetching categories");
    const data = await response.json();
    console.log("🐞 Data from API:", data);
    setCategories(data.categories); // 👈 aquí el fix
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Error al obtener las categorías");
  }
};


  const getCategorieById = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    getCategorieById,
    getCategories,
  };
};

export default useFecthCategorias;
