import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import ReviewItem from '../components/Historial/Reviews';
import SidebarCart from '../components/Cart/SidebarCart';
import './HistReviews.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const HistReviews = () => {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (authLoading || !user?.id) {
        setIsLoading(false);
        setReviews([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/reviews/user/${user.id}`);
        if (!response.ok) {
          if (response.status === 404) setReviews([]);
          else throw new Error('Error al cargar las reseñas');
        } else {
          const data = await response.json();
          setReviews(data);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error("Error al obtener las reseñas:", err);
      }
    };

    fetchReviews();
  }, [user, authLoading]);

  const handleDeleteReview = (id) => {
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  if (isLoading || authLoading) return <div className="historial-page"><h2>Cargando tus reseñas...</h2></div>;
  if (error) return <div className="historial-page"><h2>Error: {error}</h2><p>No se pudo cargar tus reseñas.</p></div>;

  return (
    <>
      <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Nav cartOpen={cartOpen} />

      <div className="historial-page">
        <div className="historial-hero">
          <div className="historial-hero-content">
            <div className="historial-hero-text">
              <h1 className="historial-title">Tu Historial de Reseñas</h1>
              <p className="historial-subtitle">Revive tus momentos especiales con nuestras joyas únicas</p>
            </div>
            <div className="historial-stats">
              <div className="stat-card">
                <div className="stat-number">{reviews.length}</div>
                <div className="stat-label">Reseñas Realizadas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="historial-orders">
          <div className="orders-container">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No has realizado ninguna reseña aún</h3>
                <p>Cuando califiques un producto, aparecerá aquí.</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="historial-item">
                  <ReviewItem review={review} onDelete={handleDeleteReview} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HistReviews;
