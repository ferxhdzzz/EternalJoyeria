import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './HomeHeroFixed.css';
import handImage from '/Home/Hand.png';
import { Link } from 'react-router-dom';

const Hero = () => {
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const handRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      [badgeRef.current, titleRef.current, subtitleRef.current, btnRef.current],
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.14,
      }
    );

    // Animate the hand image with a different effect
    gsap.fromTo(
      handRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.6,
      }
    );
  }, []);

  return (
    <div className="bloom-hero-bg">
      <div className="bloom-hero">
        <div className="badge-animation">
          <span className="bloom-hero-badge" ref={badgeRef}>MÁS DE 20 CLIENTES SATISFECHOS</span>
        </div>
        
        <div className="text-animation-group">
          <h1 className="bloom-hero-title" ref={titleRef}>
            <span className="line">Brilla con elegancia</span>
            <span className="line">Resplandece con estilo</span>
          </h1>
          <p className="bloom-hero-subtitle" ref={subtitleRef}>
            Cada pieza es una obra de arte, creada para realzar tu belleza y celebrar tus momentos más especiales. Descubre la joya que te define.
          </p>
        </div>
      </div>
      <div className="bloom-hero-hand-container">
        <img src={handImage} alt="Hand" className="bloom-hero-hand-img" ref={handRef} />
      </div>
    </div>
  );
};

export default Hero;
