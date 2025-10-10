import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen1 from './src/screens/WelcomeScreen1';
import WelcomeScreen2 from './src/screens/WelcomeScreen2';
import WelcomeScreen3 from './src/screens/WelcomeScreen3';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { setupErrorHandling } from './src/utils/errorHandler';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(-1); // Empezar con splash
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Si el estado de autenticación cambia, ajustamos la pantalla
    if (!loading) {
      if (isAuthenticated) {
        setCurrentScreen(6); // Navegador principal de la app
      } else {
        // Si no está autenticado y ya estaba en la app (currentScreen >= 4), va al Login
        if (currentScreen >= 4) {
          setCurrentScreen(4); // Pantalla de Login
        }
      }
    }
  }, [isAuthenticated, loading]);

  const handleNextScreen = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentScreen(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const navigateToScreen = useCallback((screen) => {
    if (isTransitioning) return;

    if (screen === 'Login') {
      setIsTransitioning(true);
      setCurrentScreen(4);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [isTransitioning]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    setCurrentScreen(0); // Ir a WelcomeScreen1
  }, []);

  // Mostrar splash screen personalizado al inicio
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (loading && currentScreen === 0) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen1 onNext={handleNextScreen} />;
      case 1:
        return <WelcomeScreen2 onNext={handleNextScreen} />;
      case 2:
        return <WelcomeScreen3 onNext={() => navigateToScreen('Login')} />;
      case 4: // Login y Registro ahora usan el mismo navegador
      case 5:
        return (
          <NavigationContainer>
            <AuthNavigator onNavigateToProducts={() => setCurrentScreen(6)} />
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

  return <View style={styles.container}>{renderScreen()}</View>;
};

export default function App() {
  // Configurar el manejo de errores al iniciar la app
  React.useEffect(() => {
    setupErrorHandling();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
