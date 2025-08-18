import React from "react";
import ReviewItem from "./ReviewItem";
import  "./ReviewList.css";

const ReviewList = ({ reviews }) => {
  // Aseguramos que siempre sea un array
  if (!reviews || reviews.length === 0) {
    return <p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
