import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth debe ser usado dentro de un AuthProvider');
}
return context;
};

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);

// URL del backend
const BACKEND_URL = 'http://192.168.0.11:4000'; // Cambia esto por tu IP local

// Verificar si hay un usuario guardado al iniciar la app
useEffect(() => {
checkUserSession();
}, []);

const checkUserSession = async () => {
try {
const userData = await AsyncStorage.getItem('userData');
const token = await AsyncStorage.getItem('authToken');

if (userData && token) {
const parsedUser = JSON.parse(userData);
setUser(parsedUser);
setIsAuthenticated(true);
}
} catch (error) {
console.log('Error al verificar sesión:', error);
} finally {
setLoading(false);
}
};

// Función de login que se conecta al backend
const login = async (email, password) => {
try {
const response = await fetch(`${BACKEND_URL}/api/login`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ email, password }),
});

const data = await response.json();

if (response.ok && data.success) {
// Guardar token y datos del usuario
await AsyncStorage.setItem('authToken', data.token);
await AsyncStorage.setItem('userData', JSON.stringify(data.user));

// Actualizar estado
setUser(data.user);
setIsAuthenticated(true);

return { success: true, user: data.user };
} else {
return { success: false, error: data.message || 'Credenciales inválidas' };
}
} catch (error) {
console.log('Error en login:', error);
return { success: false, error: 'Error de conexión al servidor' };
}
};

// Función de logout
const logout = async () => {
try {
// Limpiar AsyncStorage
await AsyncStorage.removeItem('userData');
await AsyncStorage.removeItem('authToken');

// Limpiar estado
setUser(null);
setIsAuthenticated(false);

return { success: true };
} catch (error) {
console.log('Error en logout:', error);
return { success: false, error: 'Error al cerrar sesión' };
}
};

// Función para actualizar datos del usuario
const updateUser = async (newData) => {
try {
const token = await AsyncStorage.getItem('authToken');
const response = await fetch(`${BACKEND_URL}/api/customers/profile`, {
method: 'PUT',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${token}`,
},
body: JSON.stringify(newData),
});

if (response.ok) {
const updatedUser = { ...user, ...newData };

// Actualizar en AsyncStorage
await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

// Actualizar estado
setUser(updatedUser);

return { success: true, user: updatedUser };
} else {
return { success: false, error: 'Error al actualizar perfil' };
}
} catch (error) {
console.log('Error al actualizar usuario:', error);
return { success: false, error: 'Error al actualizar usuario' };
}
};

// Función para actualizar foto de perfil
const updateProfileImage = async (imageUri) => {
try {
const token = await AsyncStorage.getItem('authToken');

// Crear FormData para la imagen
const formData = new FormData();
formData.append('profileImage', {
uri: imageUri,
type: 'image/jpeg',
name: 'profile.jpg',
});

const response = await fetch(`${BACKEND_URL}/api/customers/profile-image`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'multipart/form-data',
},
body: formData,
});

if (response.ok) {
const data = await response.json();
const updatedUser = { ...user, profileImage: data.profileImage };

// Actualizar en AsyncStorage
await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

// Actualizar estado
setUser(updatedUser);

return { success: true, user: updatedUser };
} else {
return { success: false, error: 'Error al actualizar foto' };
}
} catch (error) {
console.log('Error al actualizar foto:', error);
return { success: false, error: 'Error al actualizar foto' };
}
};

const value = {
user,
isAuthenticated,
loading,
login,
logout,
updateUser,
updateProfileImage,
};

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
};