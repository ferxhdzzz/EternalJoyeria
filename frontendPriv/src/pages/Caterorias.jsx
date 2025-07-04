import React from 'react';
import SidebarPrivate from '../components/Sidebar/Sidebar';
import TopNavbarPrivate from '../components/TopBar/TopBar';
import ProductGridPrivate from '../components/Products-Private/ProductGrid-Private';
import CategoriasForm from '../components/Categorias/FormPage';
import '../styles/ProductsPage-Private.css';

const Categorias = () => {
  const productsData = [
    {
      id: 1,
      image: '/Products/categoria1.png',
      name: 'Anillo de Orquídeas',
      originalPrice: 60.0,
      finalPrice: 50.0,
    },
    {
      id: 2,
      image: '/Products/categoria2.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },{
      id: 2,
      image: '/Products/categoria2.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },{
      id: 2,
      image: '/Products/categoria2.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },{
      id: 2,
      image: '/Products/categoria2.png',
      name: 'Gancho de Orquídeas',
      originalPrice: 60.0,
      discount: 10,
      finalPrice: 50.0,
    },
  ];

  return (
 <div className="products-private-page-containerr">
  <SidebarPrivate />

  <div className="main-content-wrapperr">
    <div className="fixed-topbarr">
      <TopNavbarPrivate />
    </div>

    <div className="scrollable-contentr">
      <div className="padded-content-wrapperr">
        <div className="products-area-privater">
          <ProductGridPrivate products={productsData} />
          <CategoriasForm />
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Categorias;
