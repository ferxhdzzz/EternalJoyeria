import React from 'react'; // Imports the React library, essential for creating React components.
import './HeroButton.css'; // Imports the specific stylesheet for this button component.

// Defines the HeroButton functional component. It accepts 'onClick' and 'children' as props.
const HeroButton = ({ onClick, children }) => (
  // Renders a button element with a specific class for styling and an onClick handler.
  <button className="hero-button" onClick={onClick}>
    {/* 'children' refers to any elements nested inside the HeroButton component when it's used. */}
    {children}
  </button>
);

// Exports the HeroButton component to be used in other parts of the application.
export default HeroButton;
