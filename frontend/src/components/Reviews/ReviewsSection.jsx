import React, { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import AddReviewModal from './AddReviewModal';
import ReviewStats from './ReviewStats';
import './Reviews.css';

// Componente principal de reseñas - Sección expandible en página de detalle
const ReviewsSection = ({ productId, productName }) => {
  // Estados para manejar las reseñas
  const [reviews, setReviews] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 4.8,
    totalReviews: 41,
    ratingDistribution: {
      5: 25,
      4: 10,
      3: 4,
      2: 1,
      1: 1
    }
  });

  // Simular carga de reseñas (aquí irá la llamada al backend)
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        // TODO: Reemplazar con llamada real al backend
        // const response = await fetch(`/api/products/${productId}/reviews`);
        // const data = await response.json();
        // setReviews(data.reviews);
        // setStats(data.stats);
        
        // Datos de ejemplo para desarrollo
        const mockReviews = [
          {
            id: 1,
            userId: 'user1',
            userName: 'María González',
            rating: 5,
            comment: '¡Excelente calidad! El collar es hermoso y llegó perfectamente. Definitivamente volveré a comprar.',
            date: '2024-01-15',
            verified: true
          },
          {
            id: 2,
            userId: 'user2',
            userName: 'Ana Rodríguez',
            rating: 4,
            comment: 'Muy bonito el diseño, la calidad es buena. Solo le doy 4 estrellas porque tardó un poco en llegar.',
            date: '2024-01-10',
            verified: true
          },
          {
            id: 3,
            userId: 'user3',
            userName: 'Carmen López',
            rating: 5,
            comment: 'Perfecto para regalo. Mi mamá lo amó. El empaque es elegante y el producto superó mis expectativas.',
            date: '2024-01-08',
            verified: false
          }
        ];
        
        setReviews(mockReviews);
        setIsLoading(false);
      } catch (error) {
        console.error('Error cargando reseñas:', error);
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  // Función para agregar una nueva reseña
  const handleAddReview = async (reviewData) => {
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/products/${productId}/reviews`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(reviewData)
      // });
      // const newReview = await response.json();
      
      // Simular nueva reseña
      const newReview = {
        id: Date.now(),
        userId: 'currentUser',
        userName: 'Tú',
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString().split('T')[0],
        verified: false
      };
      
      setReviews(prevReviews => [newReview, ...prevReviews]);
      
      // Actualizar estadísticas
      const newTotal = stats.totalReviews + 1;
      const newAverage = ((stats.averageRating * stats.totalReviews) + reviewData.rating) / newTotal;
      
      setStats(prevStats => ({
        ...prevStats,
        totalReviews: newTotal,
        averageRating: Math.round(newAverage * 10) / 10,
        ratingDistribution: {
          ...prevStats.ratingDistribution,
          [reviewData.rating]: (prevStats.ratingDistribution[reviewData.rating] || 0) + 1
        }
      }));
      
      setShowAddReviewModal(false);
    } catch (error) {
      console.error('Error agregando reseña:', error);
    }
  };

  // Función para eliminar una reseña (solo del usuario actual)
  const handleDeleteReview = async (reviewId) => {
    try {
      // TODO: Reemplazar con llamada real al backend
      // await fetch(`/api/reviews/${reviewId}`, {
      //   method: 'DELETE'
      // });
      
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      
      // Actualizar estadísticas
      const deletedReview = reviews.find(r => r.id === reviewId);
      if (deletedReview) {
        const newTotal = stats.totalReviews - 1;
        const newAverage = newTotal > 0 ? 
          ((stats.averageRating * stats.totalReviews) - deletedReview.rating) / newTotal : 0;
        
        setStats(prevStats => ({
          ...prevStats,
          totalReviews: newTotal,
          averageRating: Math.round(newAverage * 10) / 10,
          ratingDistribution: {
            ...prevStats.ratingDistribution,
            [deletedReview.rating]: Math.max(0, (prevStats.ratingDistribution[deletedReview.rating] || 0) - 1)
          }
        }));
      }
    } catch (error) {
      console.error('Error eliminando reseña:', error);
    }
  };

  return (
    <div className="reviews-section">
      {/* Encabezado de reseñas - Siempre visible */}
      <div className="reviews-header">
        <div className="reviews-title-section">
          <h3 className="reviews-title">Reseñas de clientes</h3>
          <div className="reviews-summary">
            <div className="rating-display">
              <span className="average-rating">{stats.averageRating}</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= stats.averageRating ? "#FFD700" : "#E0E0E0"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="total-reviews-count">
                ({stats.totalReviews} reseñas)
              </span>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="reviews-actions">
          <button 
            className="btn-add-review"
            onClick={() => setShowAddReviewModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
            </svg>
            Agregar reseña
          </button>
        </div>
      </div>

      {/* Contenido expandible */}
      <div className={`reviews-expandable ${isExpanded ? 'expanded' : ''}`}>
        {/* Estadísticas de reseñas */}
        <ReviewStats stats={stats} />

        {/* Lista de reseñas */}
        <div id="reviews-list">
          <ReviewList 
            reviews={reviews}
            isLoading={isLoading}
            onDeleteReview={handleDeleteReview}
          />
        </div>
      </div>

      {/* Modal para agregar reseña */}
      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onSubmit={handleAddReview}
        productName={productName}
        productId={productId}
      />
    </div>
  );
};

export default ReviewsSection;