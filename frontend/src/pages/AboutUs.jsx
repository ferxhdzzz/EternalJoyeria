import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import Nav from '../components/Nav/Nav';
import HeroAboutUs from '../components/AboutUs/HeroAboutUs/HeroAboutUs';
import MyStory from '../components/AboutUs/MyStory/MyStory';
import OurValues from '../components/AboutUs/OurValues/OurValues';
import MissionAndVision from '../components/AboutUs/MissionAndVision/MissionAndVision';
import Footer from '../components/Footer';
import SidebarCart from '../components/Cart/SidebarCart';

// Defines the AboutUs page component.
const AboutUs = () => {
  const [cartOpen, setCartOpen] = useState(false);

  // Forzar scroll al tope al montar la página
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    <div style={{ fontFamily: 'DM Sans, Arial, sans-serif', width: '100%', marginTop: '6rem' }}>
      {/* A container div is used to wrap the page content and apply specific styles. */}
      <div className="about-us-container" style={{ marginTop: '7rem' }}>
        {/* Renders the navigation bar at the top of the page. */}
        <SidebarCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Nav cartOpen={cartOpen} />
        {/* Renders the hero section specific to the About Us page. */}
        <HeroAboutUs />
        {/* Renders the "My Story" section. */}
        <MyStory />
        {/* Renders the "Our Values" section. */}
        <OurValues />
        {/* Renders the "Mission and Vision" section. */}
        <MissionAndVision />
        <Footer />
      </div>
    </div>
  );
};

// Exports the AboutUs component to be used in the application's routing setup.
export default AboutUs;
