import React, { useState, useEffect } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/reviews");
        
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
  }, []);

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

  if (reviews.length === 0) {
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
          {reviews.map((review, index) => {
            const customer = review.id_customer;
            const customerName = customer ? `${customer.firstName} ${customer.lastName}`.trim() : 'Cliente Anónimo';
            
            // ✅ CORRECCIÓN AQUÍ: Usamos profilePicture en lugar de avatar
            const customerAvatar = customer?.profilePicture || `https://randomuser.me/api/portraits/${customer?.gender || (index % 2 === 0 ? 'women' : 'men')}/${index + 1}.jpg`;

            return (
              <div className="card" key={review._id || index}>
                <div className="first-content">
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