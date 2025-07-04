import React from 'react';
import Hero from "../components/Products/Hero";
import ProductShowcase from '../components/Products/ProductShowcase';
import Categories from '../components/Products/Categories';
import ProductGrid from '../components/Products/ProductGrid';
import Testimonials from '../components/Products/Testimonials';
import Footer from '../components/Footer';
import RatingBox from '../components/Products/RatingBox';
import Nav from '../components/Nav/Nav';

// Defines the Products page component.
const Products = () => {
  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // React Fragment (<>) is used to group multiple elements without adding an extra node to the DOM.
    <>
      {/* Renders the navigation bar at the top of the page. */}
      <Nav />
      {/* Renders the hero section specific to the Products page. */}
      <Hero />
      {/* Renders the product showcase section. */}
      <ProductShowcase />
      {/* Renders the product categories section. */}
      <Categories />
      {/* Renders the main grid of products. */}
      <ProductGrid />
      {/* Renders the customer testimonials section. */}
      <Testimonials />
      {/* Renders the rating submission box. */}
      <RatingBox />
      {/* Renders the footer at the bottom of the page. */}
      <Footer />
    </>
  );
};

// Exports the Products component to be used in the application's routing setup.
export default Products;
