import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import WelcomeScreen1 from './src/screens/WelcomeScreen1';
import WelcomeScreen2 from './src/screens/WelcomeScreen2';
import WelcomeScreen3 from './src/screens/WelcomeScreen3';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductScreen from './src/screens/ProductScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleNextScreen = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(prev => prev + 1);
    // Reset transition state after a delay
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const navigateToScreen = useCallback((screen, data = null) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (screen === 'Login') {
      setCurrentScreen(4);
    } else if (screen === 'Register') {
      setCurrentScreen(5);
    } else if (screen === 'Products') {
      if (data) {
        setUserData(data);
      }
      setCurrentScreen(6);
    }
    
    // Reset transition state after a delay
    setTimeout(() => setIsTransitioning(false), 600);
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

  // Función para manejar el logout y volver al login
  const handleLogout = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUserData(null);
    setCurrentScreen(4);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  switch (currentScreen) {
    case 0:
      return <WelcomeScreen1 onNext={handleNextScreen} />;
    case 1:
      return <WelcomeScreen2 onNext={handleNextScreen} />;
    case 2:
      return <WelcomeScreen3 onNext={handleWelcomeToLogin} />;
    case 3:
      return <LoginScreen navigation={{ goBack: () => goBack(2), navigate: navigateToScreen }} />;
    case 4:
      return <LoginScreen navigation={{ goBack: () => goBack(2), navigate: navigateToScreen }} />;
    case 5:
      return <RegisterScreen navigation={{ goBack: () => goBack(4), navigate: navigateToScreen }} />;
    case 6:
      return <ProductScreen navigation={{ goBack: handleLogout }} userData={userData} />;
    default:
      return <WelcomeScreen1 onNext={handleNextScreen} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
