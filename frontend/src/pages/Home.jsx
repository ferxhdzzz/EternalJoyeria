import React from 'react';
import Nav from '../components/Nav/Nav';
import Hero from '../components/Home/Hero/Hero';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Nav />
    <div className="home-container">
      <Hero />
      {/* Other sections of the home page can go here */}
    </div>
    <Footer />
  </>
);

export default Home;
