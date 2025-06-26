import React, { useEffect } from 'react'; // Imports React and the useEffect hook for handling side effects.
import './Home.css'; // Imports the specific stylesheet for the Home page.

import Nav from '../components/Nav/Nav';
import Hero from '../components/Home/Hero/Hero';
import Footer from '../components/Footer';

// Defines the Home page component.
const Home = () => {
  // The useEffect hook is used to run side effects in the component.
  useEffect(() => {
    // When the component mounts, it sets the body's overflow style to 'hidden' to prevent scrolling.
    document.body.style.overflow = 'hidden';
    // The cleanup function is returned to be executed when the component unmounts.
    return () => {
      // It resets the body's overflow style to 'auto' to restore the default scrolling behavior.
      document.body.style.overflow = 'auto';
    };
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts.

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // React Fragment (<>) is used to group multiple elements without adding an extra node to the DOM.
    <>
      {/* Renders the navigation bar. Its fixed position places it above other content. */}
      <Nav />
      {/* This div is the main container for the home page content, styled with a background image. */}
      <div className="home-container">
        {/* Renders the hero section, which contains the main heading and call-to-action. */}
        <Hero />
        {/* A placeholder comment indicating where other page sections could be added. */}
        {/* Other sections of the home page can go here */}
      </div>
    </>
  );
};

// Exports the Home component to be used in the application's routing setup.
export default Home;
