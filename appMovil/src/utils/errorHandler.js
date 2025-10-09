// Configuración para suprimir alertas del emulador y errores de consola
import { LogBox } from 'react-native';

// Suprimir advertencias específicas que causan problemas
LogBox.ignoreLogs([
  'useInsertionEffect',
  'Warning: useInsertionEffect',
  'Console Error',
  'Warning: Cannot update a component',
  'Warning: setState',
  'VirtualizedLists should never be nested',
  'Animated: `useNativeDriver`',
  'Remote debugger',
  'Setting a timer',
  'componentWillReceiveProps',
  'componentWillMount',
  'componentWillUpdate',
  'Task orphaned',
  'Module RCTImageLoader',
  'Require cycle',
  'Non-serializable values were found in the navigation state',
]);

// Configurar el manejo global de errores
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Filtrar errores específicos que no queremos mostrar
console.error = (...args) => {
  const message = args.join(' ');
  
  // Lista de errores que queremos suprimir
  const suppressedErrors = [
    'useInsertionEffect',
    'Console Error',
    'Warning: useInsertionEffect',
    'Warning: Cannot update a component',
    'Warning: setState',
    'Task orphaned',
    'Module RCTImageLoader',
  ];
  
  // Solo mostrar el error si no está en la lista de suprimidos
  if (!suppressedErrors.some(error => message.includes(error))) {
    originalConsoleError.apply(console, args);
  }
};

console.warn = (...args) => {
  const message = args.join(' ');
  
  // Lista de advertencias que queremos suprimir
  const suppressedWarnings = [
    'useInsertionEffect',
    'VirtualizedLists should never be nested',
    'componentWillReceiveProps',
    'componentWillMount',
    'componentWillUpdate',
    'Setting a timer',
  ];
  
  // Solo mostrar la advertencia si no está en la lista de suprimidas
  if (!suppressedWarnings.some(warning => message.includes(warning))) {
    originalConsoleWarn.apply(console, args);
  }
};

// Función para configurar el manejo de errores no capturados
export const setupErrorHandling = () => {
  // Manejar errores no capturados en JavaScript
  const originalHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Filtrar errores específicos
    if (error.message && error.message.includes('useInsertionEffect')) {
      // No hacer nada para estos errores
      return;
    }
    
    // Para otros errores, usar el manejador original
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
};

// Función para limpiar listeners y timers
export const cleanupErrorHandling = () => {
  // Restaurar los console originales si es necesario
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};

export default {
  setupErrorHandling,
  cleanupErrorHandling,
};
