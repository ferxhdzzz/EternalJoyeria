import React, { useState } from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, isHovered, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Manejar error de imagen
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Manejar carga exitosa de imagen
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Obtener imagen de la categoría
  const getImageSrc = () => {
    if (imageError) return '/placeholder-category.png';
    if (category.image) return category.image;
    if (category.images && category.images[0]) return category.images[0];
    return '/placeholder-category.png';
  };

  // Manejar click en la categoría
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    } else {
      // Navegación por defecto (puedes cambiar esta lógica)
      console.log('Clicked category:', category.name);
      // window.location.href = `/products?category=${category._id}`;
    }
  };

  return (
    <div 
      className={`category-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ver productos de la categoría ${category.name}`}
    >
      {/* Contenedor de imagen */}
      <div className="category-image-container">
        {imageLoading && (
          <div className="image-loading">
            <div className="loading-shimmer"></div>
          </div>
        )}
        
        <img 
          src={getImageSrc()}
          alt={category.name}
          className="category-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
        
        {/* Overlay con gradiente */}
        <div className="category-overlay"></div>
        
        {/* Título siempre visible */}
        <div className="category-title">
          <h3>{category.name}</h3>
          {category.productCount && (
            <span className="product-count">
              {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Descripción que aparece al hover */}
        <div className={`category-description ${isHovered ? 'visible' : ''}`}>
          <p>{category.description || 'Descubre los mejores productos de esta categoría'}</p>
          <div className="view-more">
            <span>Ver productos</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L22 12L12 22L10.59 20.59L18.17 13H2V11H18.17L10.59 3.41L12 2Z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Badge de estado si está disponible */}
      {category.status && (
        <div className={`category-badge ${category.status.toLowerCase()}`}>
          {category.status === 'new' && '¡Nuevo!'}
          {category.status === 'popular' && 'Popular'}
          {category.status === 'sale' && 'Oferta'}
        </div>
      )}
      
      {/* Indicador de carga hover */}
      {isHovered && (
        <div className="hover-indicator">
          <div className="pulse-ring"></div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;