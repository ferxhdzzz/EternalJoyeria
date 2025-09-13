import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProductScreen from '../screens/ProductScreenNew';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Carrito') {
            iconName = 'cart';
          } else if (route.name === 'Pedidos') {
            iconName = 'receipt';
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
          marginBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={ProductScreen} />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen}
      />
      <Tab.Screen 
        name="Pedidos" 
        component={OrdersScreen}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 