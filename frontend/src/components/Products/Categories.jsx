import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/Categories.css';

const categories = [
  { title: "Collares", description: "Elegantes collares artesanales.", img: "/Products/categoria1.png" },
  { title: "Anillos", description: "Preciosa colección de anillos elegantes y casuales para el día a día.", img: "/Products/categoria2.png" },
  { title: "Accesorios para cabello", description: "Dale estilo a tu cabello con nuestros accesorios únicos.", img: "/Products/categoria3.png" },
  { title: "Brazaletes", description: "Brazaletes delicados hechos a mano.", img: "/Products/categoria4.png" },
  { title: "Conjuntos", description: "Conjuntos perfectos para resaltar tu estilo.", img: "/Products/categoria5.png" },
  { title: "Aretes", description: "Aretes llamativos y elegantes.", img: "/Products/categoria6.png" },
];

const Categories = () => (
  <section className="categories-section">
    <h2 className="categories-title">Categorías</h2>
    <p className="categories-subtitle">Elegí tu estilo, encontrá tu brillo.</p>

    <div className="swiper-button-prev custom-arrow"></div>
    <div className="swiper-button-next custom-arrow"></div>

    <Swiper
      modules={[Navigation]}
      slidesPerView={3}
      spaceBetween={30}
      loop={true}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      className="categories-carousel"
      breakpoints={{
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {categories.map((c, i) => (
        <SwiperSlide key={i}>
  <div className="category-card">
  <div className="card-top">
    <div className="image-container">
      <img src={c.img} alt={c.title} />
    </div>
    <h3>{c.title}</h3>
  </div>
  <div className="description-hover">
    <p>{c.description}</p>
  </div>
</div>
</SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default Categories;
