import React from 'react';
import SidebarPrivate from '../components/Sidebar/Sidebar';
import TopNavbarPrivate from '../components/TopBar/TopBar';
import ProductGridPrivate from '../components/Products-Private/ProductGrid-Private';
import '../styles/ProductsPage-Private.css';

const ProductsPrivate = () => {
  const productsData = [
    {
      id: 1,
      image: '/Products/categoria1.png',
      name: 'Anillo de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
    {
      id: 2,
      image: '/Products/categoria2.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
    {
      id: 3,
      image: '/Products/categoria3.png',
      name: 'Collar con hortensias',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
    {
      id: 4,
      image: '/Products/categoria4.png',
      name: 'Collar de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
    {
      id: 5,
      image: '/Products/categoria5.png',
      name: 'Collar con hortensias',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
    {
      id: 6,
      image: '/Products/categoria6.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
  ];

  return (
    <div className="products-private-page-container">
      <SidebarPrivate />
      <div className="main-content-wrapper">
        <TopNavbarPrivate />
        <div className="main-content-private">
          <div className="products-area-private">
            <ProductGridPrivate products={productsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPrivate;