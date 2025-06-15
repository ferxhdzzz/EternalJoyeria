import React from 'react'; // Imports the React library, essential for creating React components.
import Nav from '../components/Nav/Nav'; // Imports the navigation bar component.
import HeroAboutUs from '../components/AboutUs/HeroAboutUs/HeroAboutUs'; // Imports the hero section component for the About Us page.
import MyStory from '../components/AboutUs/MyStory/MyStory'; // Imports the "My Story" section component.
import OurValues from '../components/AboutUs/OurValues/OurValues'; // Imports the "Our Values" section component.
import MissionAndVision from '../components/AboutUs/MissionAndVision/MissionAndVision'; // Imports the "Mission and Vision" section component.
import ContactUs from '../components/ContactUs/ContactUs'; // Imports the contact form component.

// Defines the AboutUs page component.
const AboutUs = () => {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // React Fragment (<>) is used to group multiple elements without adding an extra node to the DOM.
    <>
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
    </>
  );
};

// Exports the AboutUs component to be used in the application's routing setup.
export default AboutUs;
