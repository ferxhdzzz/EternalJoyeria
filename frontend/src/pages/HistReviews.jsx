// src/pages/HistReviews.jsx
import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav/Nav';
import ReviewItem from '../components/Historial/Reviews';
import SidebarCart from '../components/Cart/SidebarCart';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2'; // ✅ 1. Importar SweetAlert2
import './HistReviews.css';

const API_BASE_URL = 'https://eternaljoyeria-cg5d.onrender.com/api';

const HistReviews = () => {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const userId = user?._id || user?.id;
    
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!userId) {
          setIsLoading(false);
          setReviews([]);
          setError('Debes iniciar sesión para ver tus reseñas.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 404) {
          setReviews([]);
        } else if (!response.ok) {
          throw new Error(`Error al cargar las reseñas: ${response.statusText}`);
        } else {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar las reseñas');
        console.error('Error al obtener las reseñas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchReviews();
    }
  }, [authLoading, user]);

  // ✅ 2. Lógica de eliminación corregida y mejorada
  const handleDeleteReview = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d6336c',
      cancelButtonColor: '#96a2afff',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'No se pudo eliminar la reseña.');
        }

        setReviews(prev => prev.filter(r => r._id !== id));

        Swal.fire({
          title: '¡Eliminada!',
          text: 'Tu reseña ha sido eliminada.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
        });
        console.error('Error al eliminar la reseña:', err);
      }
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="historial-page">
        <h2>Cargando tus reseñas...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        <div className="historial-page">
          <h2>Error: {error}</h2>
          <p>Asegúrate de haber iniciado sesión correctamente.</p>
        </div>
        <Footer />
      </>
    );
  }

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