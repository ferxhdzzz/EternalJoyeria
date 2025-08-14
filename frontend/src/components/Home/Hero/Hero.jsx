// Importaciones necesarias para el componente Hero
import React, { useRef, useEffect } from 'react'; // React y hooks para referencias y efectos
import { gsap } from 'gsap'; // Biblioteca de animaciones GSAP
import './HomeHeroFixed.css'; // Estilos CSS específicos del hero
import handImage from '/Home/Hand.png'; // Imagen de la mano para el hero
import { Link } from 'react-router-dom'; // Componente para navegación (no usado actualmente)

// Componente principal del Hero - Sección principal de la página de inicio
const Hero = () => {
  // Referencias para los elementos que se van a animar
  const badgeRef = useRef(null); // Referencia para el badge "MÁS DE 20 CLIENTES SATISFECHOS"
  const titleRef = useRef(null); // Referencia para el título principal
  const subtitleRef = useRef(null); // Referencia para el subtítulo
  const btnRef = useRef(null); // Referencia para botón (no usado actualmente)
  const handRef = useRef(null); // Referencia para la imagen de la mano

  // Efecto que se ejecuta cuando el componente se monta
  useEffect(() => {
    // Animación principal para los elementos de texto (badge, título, subtítulo)
    gsap.fromTo(
      [badgeRef.current, titleRef.current, subtitleRef.current, btnRef.current], // Elementos a animar
      {
        opacity: 0, // Estado inicial: invisible
        y: 30, // Estado inicial: 30px hacia abajo
      },
      {
        opacity: 1, // Estado final: completamente visible
        y: 0, // Estado final: posición original
        duration: 1.2, // Duración de la animación: 1.2 segundos
        ease: 'power3.out', // Tipo de easing: suave al final
        stagger: 0.14, // Retraso entre cada elemento: 0.14 segundos
      }
    );

    // Animación específica para la imagen de la mano con efecto diferente
    gsap.fromTo(
      handRef.current, // Elemento a animar
      {
        opacity: 0, // Estado inicial: invisible
        scale: 0.8, // Estado inicial: 80% del tamaño
        y: 50, // Estado inicial: 50px hacia abajo
      },
      {
        opacity: 1, // Estado final: completamente visible
        scale: 1, // Estado final: tamaño completo
        y: 0, // Estado final: posición original
        duration: 1.5, // Duración: 1.5 segundos
        ease: 'power3.out', // Easing suave
        delay: 0.6, // Retraso inicial: 0.6 segundos
      }
    );
  }, []); // Array vacío significa que solo se ejecuta al montar el componente

  // Estructura JSX del componente Hero
  return (
    <div className="bloom-hero-bg"> {/* Contenedor principal del hero */}
      <div className="bloom-hero"> {/* Contenedor del contenido principal */}
        <div className="badge-animation"> {/* Contenedor para el badge animado */}
          <span className="bloom-hero-badge" ref={badgeRef}>MÁS DE 20 CLIENTES SATISFECHOS</span>
        </div>
        
        <div className="text-animation-group"> {/* Grupo de elementos de texto */}
          <h1 className="bloom-hero-title" ref={titleRef}> {/* Título principal */}
            <span className="line">Brilla con elegancia</span> {/* Primera línea del título */}
            <span className="line">Resplandece con estilo</span> {/* Segunda línea del título */}
          </h1>
          <p className="bloom-hero-subtitle" ref={subtitleRef}> {/* Subtítulo descriptivo */}
            Cada pieza es una obra de arte, creada para realzar tu belleza y celebrar tus momentos más especiales. Descubre la joya que te define.
          </p>
        </div>
      </div>
      <div className="bloom-hero-hand-container"> {/* Contenedor para la imagen de la mano */}
        <img src={handImage} alt="Hand" className="bloom-hero-hand-img" ref={handRef} />
      </div>
    </div>
  );
};

// Exportación del componente para uso en otros archivos
export default Hero;
