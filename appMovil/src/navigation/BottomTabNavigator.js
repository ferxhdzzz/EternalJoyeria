import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
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
          let iconSize = focused ? 28 : 24;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Pedidos') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              marginTop: focused ? -5 : 0,
            }}>
              <Ionicons 
                name={iconName} 
                size={iconSize} 
                color={focused ? '#ec4899' : '#9ca3af'} 
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 70,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -5,
          marginBottom: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
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