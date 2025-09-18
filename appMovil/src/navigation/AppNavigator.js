import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen 
        name="PrivacyPolicy" 
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen 
        name="TermsConditions" 
        component={TermsConditionsScreen}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Detalle del producto',
          headerBackTitleVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
      />
      <Stack.Screen 
        name="VerifyCode" 
        component={VerifyCodeScreen}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: 'Cambiar contraseña',
          headerBackTitleVisible: false,
          headerTintColor: '#2c3e50',
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 