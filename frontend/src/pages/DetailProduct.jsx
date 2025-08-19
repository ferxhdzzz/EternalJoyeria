import React, { useEffect, useState } from "react";
import ReviewList from "../components/Reviews/ReviewList";
import AddReviewModal from "../components/Reviews/AddReviewModal";

const ProductDetail = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🚀 Cargar reseñas al montar
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/reviews/product/${product._id}`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      }
    };

    fetchReviews();
  }, [product._id]);

  // 🚀 Cuando se agrega una nueva reseña desde el modal
  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div>
      <h1>{product.name}</h1>

      <button onClick={() => setIsModalOpen(true)}>Escribir reseña</button>

      <ReviewList reviews={reviews} />

      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewReview}   // 🔥 aquí conectamos
        productName={product.name}
        productId={product._id}
      />
    </div>
  );
};

export default ProductDetail;
