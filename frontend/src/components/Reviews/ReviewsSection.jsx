import React, { useState, useEffect } from 'react';
import ReviewList from './ReviewList';
import AddReviewModal from './AddReviewModal';
import ReviewStats from './ReviewStats';
import './Reviews.css';

const ReviewsSection = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Función para calcular las estadísticas a partir de las reseñas
  const calculateStats = (reviews) => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    let totalRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      totalRating += review.rank;
      ratingDistribution[review.rank] = (ratingDistribution[review.rank] || 0) + 1;
    });

    const averageRating = totalRating / totalReviews;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    };
  };

  // ✅ Carga inicial de reseñas desde la API
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/reviews/product/${productId}`);
      if (!response.ok) {
        // Maneja el caso de que no haya reseñas para el producto
        if (response.status === 404) {
          setReviews([]);
          setStats(calculateStats([]));
        } else {
          throw new Error('Error al cargar las reseñas');
        }
      } else {
        const data = await response.json();
        setReviews(data);
        setStats(calculateStats(data));
      }
    } catch (error) {
      console.error('Error cargando reseñas:', error);
      // Opcional: mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // ✅ Función para agregar una nueva reseña
  const handleAddReview = async (reviewData) => {
    // La lógica de envío ya está en AddReviewModal.jsx,
    // aquí solo actualizamos los datos después del éxito.
    // ✅ Volvemos a cargar las reseñas desde el backend para tener los datos más recientes
    await fetchReviews(); 
    setShowAddReviewModal(false);
  };

  // Función para eliminar una reseña
  const handleDeleteReview = async (reviewId) => {
    try {
      // ✅ Llamada al backend para eliminar la reseña
      const response = await fetch(`https://eternaljoyeria-cg5d.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la reseña');
      }
      
      // ✅ Volvemos a cargar las reseñas después de eliminar
      await fetchReviews();

    } catch (error) {
      console.error('Error eliminando reseña:', error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <div className="reviews-title-section">
          <h3 className="reviews-title">Reseñas de clientes</h3>
          <div className="reviews-summary">
            <div className="rating-display">
              <span className="average-rating">{stats.averageRating.toFixed(1)}</span>
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

      <div className={`reviews-expandable ${isExpanded ? 'expanded' : ''}`}>
        <ReviewStats stats={stats} />

        <div id="reviews-list">
          <ReviewList 
            reviews={reviews}
            isLoading={isLoading}
            onDeleteReview={handleDeleteReview}
          />
        </div>
      </div>

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