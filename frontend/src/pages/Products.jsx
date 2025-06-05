import React from 'react';
import Hero from '../components/Menu/Hero';
import ProductShowcase from '../components/Menu/ProductShowcase';
import Categories from '../components/Menu/Categories';
import ProductGrid from '../components/Menu/ProductGrid';
import Testimonials from '../components/Menu/Testimonials';
import Footer from '../components/Menu/Footer';
import RatingBox from '../components/Menu/RatingBox';
import Nav from '../components/Nav/Nav';

const Products = () => {
  return (
    <>
      <Nav />
      <Hero />
      <ProductShowcase />
      <Categories />
      <ProductGrid />
      <Testimonials />
      <RatingBox />
      <Footer />
    </>
  );
};

export default Products;
