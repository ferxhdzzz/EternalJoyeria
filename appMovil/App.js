import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import WelcomeScreen1 from './src/screens/WelcomeScreen1';
import WelcomeScreen2 from './src/screens/WelcomeScreen2';
import WelcomeScreen3 from './src/screens/WelcomeScreen3';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextScreen = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(prev => prev + 1);
    // Reset transition state after a delay
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const navigateToScreen = useCallback((screen, data = null) => {
    if (isTransitioning) return;
    
    if (screen === 'Login') {
      setIsTransitioning(true);
      setCurrentScreen(4);
      // Reset transition state after a delay
      setTimeout(() => setIsTransitioning(false), 600);
    } else if (screen === 'Register') {
      setIsTransitioning(true);
      setCurrentScreen(5);
      // Reset transition state after a delay
      setTimeout(() => setIsTransitioning(false), 600);
    } else if (screen === 'Products') {
      // Para la pantalla de productos, no usar animación para evitar doble transición
      setCurrentScreen(6);
    }
  }, [isTransitioning]);

  const goBack = useCallback((targetScreen) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(targetScreen);
    // Reset transition state after a delay
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  // Función para manejar la transición desde WelcomeScreen3 al Login
  const handleWelcomeToLogin = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(4);
    // Reset transition state after a delay
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen1 onNext={handleNextScreen} />;
      case 1:
        return <WelcomeScreen2 onNext={handleNextScreen} />;
      case 2:
        return <WelcomeScreen3 onNext={handleWelcomeToLogin} />;
      case 3:
        return (
          <NavigationContainer>
            <AuthNavigator onNavigateToProducts={navigateToScreen} />
          </NavigationContainer>
        );
      case 4:
        return (
          <NavigationContainer>
            <AuthNavigator onNavigateToProducts={navigateToScreen} />
          </NavigationContainer>
        );
      case 5:
        return (
          <NavigationContainer>
            <AuthNavigator onNavigateToProducts={navigateToScreen} />
          </NavigationContainer>
        );
      case 6:
        return (
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        );
      default:
        return <WelcomeScreen1 onNext={handleNextScreen} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        {renderScreen()}
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
