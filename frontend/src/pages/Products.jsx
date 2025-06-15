import React from 'react';
import Hero from "../components/Products/Hero";
import ProductShowcase from '../components/Products/ProductShowcase';
import Categories from '../components/Products/Categories';
import ProductGrid from '../components/Products/ProductGrid';
import Testimonials from '../components/Products/Testimonials';
import Footer from '../components/Products/Footer';
import RatingBox from '../components/Products/RatingBox';
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
