import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- importamos Link
import useCategories from '../../hooks/Categorias/useCategories';
import './CategoriesCarousel.css';

const CategoriesCarousel = () => {
  const { categories, loading, error } = useCategories();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current || !categories.length) return;

    const scrollEl = scrollRef.current;
    let scrollAmount = 0;
    const speed = 1;

    scrollEl.innerHTML = scrollEl.innerHTML + scrollEl.innerHTML;

    const step = () => {
      scrollAmount += speed;
      if (scrollAmount >= scrollEl.scrollWidth / 2) scrollAmount = 0;
      scrollEl.scrollLeft = scrollAmount;
      requestAnimationFrame(step);
    };

    const animation = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation);
  }, [categories]);

  if (loading) return <div className="categories-carousel-container">Cargando...</div>;
  if (error) return <div className="categories-carousel-container">Error...</div>;

  const loopCategories = [...categories, ...categories];

  return (
    <div className="categories-carousel-container">
      <h2>Explorar Categorías</h2>
      <br />
      <div className="categories-carousel">
        <br />
        <br />
        <br />
        <div className="categories-scroll" ref={scrollRef}>
        <br />
        <br />
        <br />
          {loopCategories.map((category, index) => (
            <Link
              key={category._id + index}
              to={`/category/${category._id}`} // <-- ruta a la página de productos
              className="category-card-link"
            >
              <div className="category-card">
                <div className="category-card-image">
                  <img
                    src={category.image || '/placeholder-category.png'}
                    alt={category.name || 'Categoría'}
                  />
                </div>
                <div className="category-card-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
               
                </div>
             
              </div>
              <br />
            </Link>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesCarousel;
