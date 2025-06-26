import React from 'react';
import './AboutUs.css';
import Nav from '../components/Nav/Nav';
import HeroAboutUs from '../components/AboutUs/HeroAboutUs/HeroAboutUs';
import MyStory from '../components/AboutUs/MyStory/MyStory';
import OurValues from '../components/AboutUs/OurValues/OurValues';
import MissionAndVision from '../components/AboutUs/MissionAndVision/MissionAndVision';
import ContactUs from '../components/ContactUs/ContactUs';
import Footer from '../components/Footer';

// Defines the AboutUs page component.
const AboutUs = () => {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // A container div is used to wrap the page content and apply specific styles.
    <div className="about-us-container">
      {/* Renders the navigation bar at the top of the page. */}
      <Nav />
      {/* Renders the hero section specific to the About Us page. */}
      <HeroAboutUs />
      {/* Renders the "My Story" section. */}
      <MyStory />
      {/* Renders the "Our Values" section. */}
      <OurValues />
      {/* Renders the "Mission and Vision" section. */}
      <MissionAndVision />
      {/* Renders the contact form section at the bottom of the page. */}
      <ContactUs />
            <Footer />
    </div>
  );
};

// Exports the AboutUs component to be used in the application's routing setup.
export default AboutUs;
