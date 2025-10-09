import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const api = "https://eternaljoyeria-cg5d.onrender.com/api/reviews";

const useFetchResenas = () => { // Corregido a useFetchResenas
  const [reviews, setReviews] = useState([]);
  // Nuevo estado para almacenar la lista única de productos
  const [products, setProducts] = useState([]); 

  const getReviews = async () => {
    try {
      const response = await fetch(api, {
        credentials: "include", 
      });
      if (!response.ok) {
        throw new Error("Error fetching Reviews");
      }
      const data = await response.json();
      setReviews(data);
      
      // Extraer productos únicos para el filtro
      const uniqueProducts = data.reduce((acc, review) => {
          if (review.id_product && review.id_product.name && !acc.some(p => p._id === review.id_product._id)) {
              acc.push({
                  _id: review.id_product._id,
                  name: review.id_product.name
              });
          }
          return acc;
      }, [{ _id: "all", name: "Todos los productos" }]); // Opción por defecto
      setProducts(uniqueProducts);

    } catch (error) {
      console.error("error fetching Reviews", error);
      toast.error("error fetching Reviews");
    }
  };

  const getReviewById = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Failed to fetch review");
        throw new Error("Failed to fetch review");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching review:", error);
      return null;
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return {
    reviews,
    getReviewById,
    getReviews,
    products // Devolvemos la lista de productos
  };
};

export default useFetchResenas;