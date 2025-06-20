import React from 'react';
import Nav from '../components/Nav/Nav';
import HeroAboutUs from '../components/AboutUs/HeroAboutUs/HeroAboutUs';
import MyStory from '../components/AboutUs/MyStory/MyStory';
import OurValues from '../components/AboutUs/OurValues/OurValues';
import MissionAndVision from '../components/AboutUs/MissionAndVision/MissionAndVision';
import ContactUs from '../components/ContactUs/ContactUs';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <>
      <Nav />
      <HeroAboutUs />
      <MyStory />
      <OurValues />
      <MissionAndVision />
      <ContactUs />
      <Footer />
    </>
  );
};

export default AboutUs;
