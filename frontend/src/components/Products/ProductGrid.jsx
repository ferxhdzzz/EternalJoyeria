import React from 'react'; // Imports the React library, essential for creating React components.
import '../../styles/ProductGrid.css'; // Imports the custom stylesheet for this component.

// Defines an array of product objects, each with a name, price, and image path.
const products = [
  { name: 'Collar con corazón',    price: '$25.00', img: '/Products/product1.png' },
  { name: 'Pulsera flor',          price: '$20.00', img: '/Products/product2.png' },
  { name: 'Anillo pastel',         price: '$30.00', img: '/Products/product3.png' },
  { name: 'Collar mini dije',      price: '$25.00', img: '/Products/product4.png' },
  { name: 'Pulsera rosa',          price: '$35.00', img: '/Products/product5.png' },
  { name: 'Collar personalizado',  price: '$30.00', img: '/Products/product6.png' },
];

// Defines the ProductGrid functional component.
const ProductGrid = () => (
  // The main section element for the product grid.
  <section className="product-grid">
    {/* The title for the product grid section. */}
    <h2>Algunos de nuestros productos</h2>

    {/* A container for the grid of products. */}
    <div className="grid">
      {/* Maps over the 'products' array to create a grid item for each product. */}
      {products.map(({ name, price, img }) => (
        // A container for a single product item. The 'key' is essential for React's list rendering.
        <div key={name} className="grid-item">
          {/* The product image. */}
          <img src={img} alt={name} />
          {/* The product name. */}
          <p className="product-name">{name}</p>
          {/* The product price. */}
          <p className="product-price">{price}</p>
        </div>
      ))}
    </div>
  </section>
);

// Exports the ProductGrid component to be used in other parts of the application.
export default ProductGrid;
