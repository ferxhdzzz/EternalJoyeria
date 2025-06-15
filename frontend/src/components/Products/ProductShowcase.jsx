import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/ProductShowcase.css'; // Imports the custom stylesheet for this component.

// Defines an array of product objects to be showcased.
const products = [
  { id: 1, name: 'Natural Plants', price: '$20.00', img: '/Products/product1.png' },
  { id: 2, name: 'Artificial Plants', price: '$25.00', img: '/Products/product2.png' },
  { id: 3, name: 'Artificial Plants', price: '$30.00', img: '/Products/product3.png' },
];

// Defines the ProductShowcase functional component.
const ProductShowcase = () => (
  // The main section element for the product showcase.
  <section className="product-showcase">
    {/* A container for all the content within the showcase. */}
    <div className="showcase-content">
      {/* A section for the descriptive text. */}
      <div className="text-section">
        {/* The main headline for the showcase. */}
        <h2>Las mejores ofertas</h2>
        {/* A paragraph providing more details about the offers. */}
        <p>Disfruta de nuestras ofertas más exclusivas del momento.</p>
      </div>
      {/* A container for the showcased products. */}
      <div className="products">
        {/* Maps over the 'products' array to display each product. */}
        {products.map(({ id, name, price, img }) => (
          // A container for a single product. The 'key' is crucial for React's rendering.
          <div key={id} className="product">
            {/* The product image. */}
            <img src={img} alt={name} />
            {/* A container for the product's information. */}
            <div className="product-info">
              {/* The product name. */}
              <h4>{name}</h4>
              {/* The product price. */}
              <span>{price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Exports the ProductShowcase component for use in other parts of the application.
export default ProductShowcase;
