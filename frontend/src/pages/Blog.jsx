// Importa React y useState para manejar el estado local
import React, { useState } from 'react';
// Importa el Footer para mostrarlo al final de la página
import Footer from '../components/Footer';
import Nva from '../components/Nav/Nav';
// Importa los estilos específicos del blog
import '../styles/Blog.css';

// Array de artículos del blog (puedes agregar más aquí)
const blogPosts = [
  {
    id: 1,
    title: 'Cómo cuidar tus joyas de resina',
    image: '/Products/CollarOrchid.png',
    excerpt: 'Descubre los mejores consejos para mantener tus joyas de resina como nuevas por más tiempo.',
    content: 'Las joyas de resina requieren cuidados especiales para mantener su brillo y belleza. Límpialas con un paño suave, evita el contacto con productos químicos y guárdalas en un lugar seco.'
  },
  {
    id: 2,
    title: 'Tendencias en joyería artesanal 2024',
    image: '/Products/AretesOrchid.png',
    excerpt: 'Conoce las tendencias que marcarán la moda en joyería artesanal este año.',
    content: 'Este 2024, la joyería artesanal apuesta por materiales naturales, colores vibrantes y diseños personalizados que reflejan la personalidad de quien los lleva.'
  },
  {
    id: 3,
    title: 'El proceso detrás de cada pieza',
    image: '/Products/PeinetaOrchid.png',
    excerpt: 'Te contamos cómo creamos cada joya, desde la inspiración hasta el producto final.',
    content: 'Cada pieza es única y hecha a mano. Seleccionamos flores naturales, las preservamos y las encapsulamos en resina, cuidando cada detalle para lograr una joya especial.'
  }
];

// Componente principal del Blog
const Blog = () => {
  // Estado para controlar qué post está seleccionado (para el modal)
  const [selectedPost, setSelectedPost] = useState(null);

  return (

    
    
    <div className="blog-page-container">

       <Nva />
       <br />
       <br />
       <br />
       <br />
      {/* Encabezado del blog con título y descripción */}
      <header className="blog-header">
        <h1>Blog Eternal</h1>
        <p>Inspiración, consejos y novedades sobre joyería artesanal y flores preservadas.</p>
      </header>

      {/* Sección de tarjetas de artículos del blog */}
      <section className="blog-cards-section">
        {blogPosts.map(post => (
          // Cada tarjeta representa un artículo
          <div key={post.id} className="blog-card" onClick={() => setSelectedPost(post)}>
            <img src={post.image} alt={post.title} className="blog-card-image" />
            <div className="blog-card-content">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              {/* Botón para leer más (abre el modal) */}
              <button className="blog-read-more">Leer más</button>
            </div>
          </div>
        ))}
      </section>

      {/* Modal que muestra el contenido completo del artículo seleccionado */}
      {selectedPost && (
        <div className="blog-modal" onClick={() => setSelectedPost(null)}>
          <div className="blog-modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedPost.image} alt={selectedPost.title} className="blog-modal-image" />
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
            {/* Botón para cerrar el modal */}
            <button className="blog-close-btn" onClick={() => setSelectedPost(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Footer de la página */}
      <Footer />
    </div>
  );
};

export default Blog; 