import React from 'react'; // Imports the React library, essential for creating React components.
import { useNavigate } from 'react-router-dom'; // Imports the useNavigate hook for navigation.
import './HeroButton.css'; // Imports the specific stylesheet for this button component.

// Defines the HeroButton functional component. It accepts 'children' as a prop.
const HeroButton = ({ children }) => {
  const navigate = useNavigate(); // Initializes the navigate function.

  // Handles the button click event and navigates to the /profile page.
  const handleClick = () => {
    navigate('/profile');
  };

  return (
    // Renders a button element with a specific class for styling and an onClick handler.
    <button className="hero-button" onClick={handleClick}>
      {/* 'children' refers to any elements nested inside the HeroButton component when it's used. */}
      {children}
    </button>
  );
};

// Exports the HeroButton component to be used in other parts of the application.
export default HeroButton;
