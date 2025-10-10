import React, { useState, useEffect } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Lógica para la actualización automática ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://eternaljoyeria-cg5d.onrender.com/api/reviews");

        if (!response.ok) {
          throw new Error('Error al cargar las reseñas');
        }

        const data = await response.json();
        setReviews(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error("Error al obtener las reseñas:", err);
      }
    };

    fetchReviews();

    // Auto actualización cada 60 segundos
    const intervalId = setInterval(fetchReviews, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Función auxiliar para renderizar el contenido de una reseña
  const renderReviewContent = (review, index) => {
    const customer = review.id_customer;
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.trim() : 'Cliente Anónimo';

    const customerAvatar = customer?.profilePicture ||
      `https://randomuser.me/api/portraits/${customer?.gender || (index % 2 === 0 ? 'women' : 'men')}/${index + 1}.jpg`;

    return (
      <div className="review">
        <img
          src={customerAvatar}
          className="avatar"
          alt={customerName}
        />

        <h3 className="name">{customerName}</h3>

        <div className="stars">
          {'★'.repeat(review.rank)}
          {'☆'.repeat(5 - review.rank)}
        </div>
        <p className="comment">{review.comment}</p>
      </div>
    );
  };

  // --- 2. Limitar a solo las primeras 3 reseñas ---
  const top3Reviews = reviews.slice(0, 3);

  // --- 3. Estados de carga y error ---
  if (isLoading) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <h2>Cargando reseñas...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <h2>Error: {error}</h2>
          <p>No se pudieron cargar las reseñas. Intenta de nuevo más tarde.</p>
        </div>
      </section>
    );
  }

  if (top3Reviews.length === 0) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <h2>¿Qué opinan nuestros clientes?</h2>
          <p>¡Sé el primero en dejar una reseña!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">¿Qué opinan nuestros clientes?</h2>
        <div className="reviews-row">
          {top3Reviews.map((review, index) => {
            const nextReviewIndex = (reviews.findIndex(r => r._id === review._id) + 1) % reviews.length;
            const nextReview = reviews[nextReviewIndex];

            return (
              <div className="card" key={review._id || index}>
                <div className="first-content">
                  {renderReviewContent(review, index)}
                </div>
                <div className="second-content next-review">
                  <p className="next-review-title">Vea la siguiente reseña:</p>
                  {renderReviewContent(nextReview, nextReviewIndex)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
