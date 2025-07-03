import React from 'react';
import SidebarPrivate from '../components/Sidebar/Sidebar';
import TopNavbarPrivate from '../components/TopBar/TopBar';
import ProductGridPrivate from '../components/Products-Private/ProductGrid-Private';
import '../styles/PaginaProduct.css';

const ProductsPrivate = () => {
 const productsData = [
  {
    id: 1,
    images: ['/Products/categoria1.png', '/Products/categoria2.png'],
    name: 'Anillo de Orquídeas',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
  {
    id: 2,
    images: ['/Products/categoria2.png', '/Products/categoria1.png'],
    name: 'Gancho de Orquídeas',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
  {
    id: 3,
    images: ['/Products/categoria3.png', '/Products/categoria4.png'],
    name: 'Collar con hortensias',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
  {
    id: 4,
    images: ['/Products/categoria4.png', '/Products/categoria3.png'],
    name: 'Collar de Orquídeas',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
  {
    id: 5,
    images: ['/Products/categoria5.png', '/Products/categoria6.png'],
    name: 'Collar con hortensias',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
  {
    id: 6,
    images: ['/Products/categoria6.png', '/Products/categoria5.png'],
    name: 'Gancho de Orquídeas',
    originalPrice: 60.0,
    discount: 10,
    finalPrice: 50.0,
  },
];


  return (
    <div className="products-private-page-containers">
      <SidebarPrivate />
      <div className="main-content-wrappers">
        <TopNavbarPrivate />
        <div className="main-content-privates">
          <div className="products-area-privates">
            <ProductGridPrivate products={productsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPrivate;