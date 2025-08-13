import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProductScreen from '../screens/ProductScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation, userData, updateUserProfileImage }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Carrito') {
            iconName = 'cart';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFE7E7',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          marginBottom: 20, // Mover el menú más arriba para evitar la barra del iPhone
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={ProductScreen}
        initialParams={{ navigation }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen}
        initialParams={{ navigation }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        initialParams={{ navigation, userData, updateUserProfileImage }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 