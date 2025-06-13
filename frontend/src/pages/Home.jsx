import React from 'react';
import Nav from '../components/Nav/Nav';
import ParticleAnimation from '../components/Home/Particles/ParticleAnimation';
import Hero from '../components/Home/Hero/Hero';

const Home = () => (
  <>
    <Nav /> {/* Nav is rendered first, but its fixed positioning takes it out of normal flow */}
    <div className="home-container">
      <ParticleAnimation /> {/* Should be behind Hero due to z-index in CSS */}
      <Hero />
      {/* Other sections of the home page can go here */}
    </div>
  </>
);

export default Home;
