import React from 'react'; // Imports the React library, essential for creating React components.
import { Swiper, SwiperSlide } from 'swiper/react'; // Imports Swiper components for creating carousels.
import { Navigation } from 'swiper/modules'; // Imports the Navigation module for Swiper to enable arrow navigation.
import 'swiper/css'; // Imports the core styles for Swiper.
import 'swiper/css/navigation'; // Imports the navigation-specific styles for Swiper.
import '../../styles/Categories.css'; // Imports the custom stylesheet for this component.

// Defines an array of category objects, each with a title, description, and image path.
const categories = [
  { title: "Collares", description: "Elegantes collares artesanales.", img: "/Products/categoria1.png" },
  { title: "Anillos", description: "Preciosa colección de anillos elegantes y casuales para el día a día.", img: "/Products/categoria2.png" },
  { title: "Accesorios para cabello", description: "Dale estilo a tu cabello con nuestros accesorios únicos.", img: "/Products/categoria3.png" },
  { title: "Brazaletes", description: "Brazaletes delicados hechos a mano.", img: "/Products/categoria4.png" },
  { title: "Conjuntos", description: "Conjuntos perfectos para resaltar tu estilo.", img: "/Products/categoria5.png" },
  { title: "Aretes", description: "Aretes llamativos y elegantes.", img: "/Products/categoria6.png" },
];

// Defines the Categories functional component.
const Categories = () => (
  // The main section element for the categories content.
  <section className="categories-section">
    {/* The main title for the categories section. */}
    <h2 className="categories-title">Categorías</h2>
    {/* The subtitle providing a tagline for the section. */}
    <p className="categories-subtitle">Elegí tu estilo, encontrá tu brillo.</p>

    {/* Custom navigation arrow for going to the previous slide. */}
    <div className="swiper-button-prev custom-arrow"></div>
    {/* Custom navigation arrow for going to the next slide. */}
    <div className="swiper-button-next custom-arrow"></div>

    {/* The Swiper component that creates the carousel. */}
    <Swiper
      modules={[Navigation]} // Registers the Navigation module with Swiper.
      slidesPerView={3} // Sets the number of slides to be visible at the same time on larger screens.
      spaceBetween={30} // Sets the space between slides in pixels.
      loop={true} // Enables continuous looping of the slides.
      navigation={{
        nextEl: '.swiper-button-next', // Selector for the next button.
        prevEl: '.swiper-button-prev', // Selector for the previous button.
      }}
      className="categories-carousel" // Custom class for styling the carousel container.
      breakpoints={{ // Defines responsive settings for different screen sizes.
        320: { slidesPerView: 1 }, // On screens 320px and up, show 1 slide.
        768: { slidesPerView: 2 }, // On screens 768px and up, show 2 slides.
        1024: { slidesPerView: 3 }, // On screens 1024px and up, show 3 slides.
      }}
    >
      {/* Maps over the 'categories' array to create a SwiperSlide for each category. */}
      {categories.map((c, i) => (
        <SwiperSlide key={i}>
          {/* The container for a single category card. */}
          <div className="category-card">
            {/* The top part of the card containing the image and title. */}
            <div className="card-top">
              {/* A container for the image to help with styling. */}
              <div className="image-container">
                {/* The category image. */}
                <img src={c.img} alt={c.title} />
              </div>
              {/* The category title. */}
              <h3>{c.title}</h3>
            </div>
            {/* A container for the description that appears on hover. */}
            <div className="description-hover">
              {/* The category description text. */}
              <p>{c.description}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

// Exports the Categories component to be used in other parts of the application.
export default Categories;
