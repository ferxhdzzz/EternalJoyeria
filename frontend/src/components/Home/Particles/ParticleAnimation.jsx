import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './ParticleAnimation.css'; // Ensure this line is present and correct

const generateParticles = () => {
  // Aumentar la frecuencia del rosado y verde
  const colors = [
    '#CC7CAF', '#CC7CAF',                  // Pink (2)
    '#CFE8D5', '#CFE8D5', '#CFE8D5', '#CFE8D5', // Green (4)
    '#D4AF37', '#D4AF37', '#D4AF37',         // Yellow/Gold (3)
    '#FEF8F0',                               // Off-white (1)
    '#E6B7A9'                                // Light Peach (1)
  ];
  // Total 12 color entries, leading to more greens and yellows.
  const particles = [];
  for (let i = 0; i < 8; i++) { // Número reducido de partículas
    particles.push({
      id: i,
      size: Math.random() * 250 + 150, // Rango de tamaño drásticamente aumentado: 150px a 400px
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return particles;
};

const ParticleAnimation = () => {
  const [particlesData] = useState(generateParticles); // Renombrado para claridad
  const containerRef = useRef(null); // Ref para el contenedor principal de las partículas

  useEffect(() => {
    const ctx = gsap.context(() => {
      // particlesRef.current ahora se refiere a los elementos DOM directamente
      // seleccionados dentro de este contexto, no necesitamos el array de refs separado de la misma manera.
      const particleElements = gsap.utils.toArray('.particle', containerRef.current);

      particleElements.forEach((particleEl, index) => {
        const particleData = particlesData[index]; // Usar los datos generados
        if (!particleData) return; // Seguridad por si acaso

        // Estado inicial para cada ciclo de animación
        let initialX = Math.random() * 100;
        let initialY = Math.random() * 100;

        if (particleData.color === '#CC7CAF' || particleData.color === '#CFE8D5') {
          // Rosadas y Verdes: Concentrar en la izquierda (0-60% del ancho) y centro vertical (20-80% del alto)
          initialX = Math.random() * 60; // 0vw a 60vw
          initialY = Math.random() * 60 + 20; // 20vh a 80vh
        }

        gsap.set(particleEl, {
          x: `${initialX}vw`,
          y: `${initialY}vh`,
          width: particleData.size,
          height: particleData.size,
          backgroundColor: particleData.color,
          autoAlpha: 0, // Usar autoAlpha para opacidad y visibilidad
          rotation: Math.random() * 360,
        });

        // Animación para cada partícula. La propiedad 'opacity' aquí define el pico de visibilidad.
        const animationProps = {
          autoAlpha: 0.25, // Usar autoAlpha
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          rotation: `+=${Math.random() * 120 - 60}`,
          duration: Math.random() * 4 + 4, // Duración ligeramente ajustada para una fase (4-8 segundos), para dar más tiempo al fade
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3,
          onRepeat: () => {
            const newSize = Math.random() * 250 + 150;
            let newX = Math.random() * 100;
            let newY = Math.random() * 100;

            // Reutilizar la lógica de posicionamiento basada en color
            // Necesitamos acceder al color original de la partícula, que está en particleData
            // particleEl no tiene esta info directamente, pero podemos obtenerla del 'index' si lo pasamos
            // Sin embargo, GSAP onRepeat no pasa el índice. Una forma es leer el backgroundColor actual.
            constcurrentColor = gsap.getProperty(particleEl, "backgroundColor");
            const pinkColorRGB = "rgb(204, 124, 175)"; // #CC7CAF
            const greenColorRGB = "rgb(207, 232, 213)"; // #CFE8D5

            if (currentColor === pinkColorRGB || currentColor === greenColorRGB) {
              newX = Math.random() * 60; // 0vw a 60vw
              newY = Math.random() * 60 + 20; // 20vh a 80vh
            }

            gsap.set(particleEl, {
              x: `${newX}vw`,
              y: `${newY}vh`,
              width: newSize,
              height: newSize,
              autoAlpha: 0, // Usar autoAlpha
              rotation: Math.random() * 360,
            });
          },
        };
        gsap.to(particleEl, animationProps);
      });
    }, containerRef); // Alcance del contexto al contenedor de partículas

    return () => ctx.revert(); // Limpieza de GSAP cuando el componente se desmonta
  }, [particlesData]); // Re-ejecutar si particlesData cambia (aunque aquí es constante después del montaje inicial)

  return (
    <div className="particles-container" ref={containerRef}>
      {particlesData.map((particle) => (
        <div
          key={particle.id}
          className="particle" // GSAP seleccionará estos elementos por su clase dentro del contexto
          // Los estilos iniciales como tamaño y color se pueden aplicar aquí o dejar que GSAP los maneje con set()
          // Style prop es menos necesario aquí si GSAP maneja todo desde el inicio
        />
      ))}
    </div>
  );
};

export default ParticleAnimation;
