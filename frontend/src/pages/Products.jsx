import React from 'react'; // Imports the React library, essential for creating React components.
import Hero from "../components/Products/Hero"; // Imports the hero section component for the Products page.
import ProductShowcase from '../components/Products/ProductShowcase'; // Imports the product showcase component.
import Categories from '../components/Products/Categories'; // Imports the product categories component.
import ProductGrid from '../components/Products/ProductGrid'; // Imports the grid display for products.
import Testimonials from '../components/Products/Testimonials'; // Imports the customer testimonials component.
import Footer from '../components/Products/Footer'; // Imports the page footer component.
import RatingBox from '../components/Products/RatingBox'; // Imports the rating box component.
import Nav from '../components/Nav/Nav'; // Imports the navigation bar component.

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
