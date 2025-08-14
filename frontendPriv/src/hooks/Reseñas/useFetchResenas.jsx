import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const api = "http://localhost:4000/api/reviews";

const useFecthReviews = () => {
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const response = await fetch(api, {
        credentials: "include", // ← incluye cookies de sesión
      });
      if (!response.ok) {
        throw new Error("Error fetching Reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("error fetching Reviews", error);
      toast.error("error fetching Reviews");
    }
  };

  const getReviewById = async (id) => {
    try {
      const response = await fetch(`${api}/${id}`, {
        credentials: "include", // ← también aquí
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
  };
};

export default useFecthReviews;
