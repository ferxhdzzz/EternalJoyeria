import React from "react";
import { TestimonialsSection } from "./testimonials-with-marquee";

// Testimonios personalizados para Eternal Joyería
const testimonials = [
  {
    author: {
      name: "Jennifer Teos",
      handle: "@jennifer",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    text: "Compré una pieza para mi madre y quedó encantada con la calidad. ¡Lo recomiendo totalmente!",
  },
  {
    author: {
      name: "María López",
      handle: "@marialopez",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    text: "El diseño es precioso y la atención al cliente fue excelente. ¡Volveré a comprar sin duda!",
  },
  {
    author: {
      name: "Carlos Rivera",
      handle: "@carlosrivera",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    text: "Me sorprendió la rapidez del envío y la calidad de la joya. ¡Muy recomendable!"
  },
  {
    author: {
      name: "Ana Martínez",
      handle: "@anamartinez",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    text: "Las joyas son hermosas y únicas. El empaque es elegante y perfecto para regalo."
  },
  {
    author: {
      name: "Roberto Sánchez",
      handle: "@robertosanchez",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    text: "Compré un collar para mi esposa y le encantó. La calidad es excepcional y el diseño muy elegante."
  }
];

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="¿Qué opinan nuestros clientes?"
      description="Descubre lo que nuestros clientes dicen sobre nuestras joyas y servicio"
      testimonials={testimonials}
    />
  );
} 