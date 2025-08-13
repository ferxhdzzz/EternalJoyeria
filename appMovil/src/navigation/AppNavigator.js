import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator();

// Componente separado para evitar la función inline
const MainTabsComponent = ({ navigation, userData, updateUserProfileImage }) => (
  <BottomTabNavigator 
    navigation={navigation}
    userData={userData}
    updateUserProfileImage={updateUserProfileImage}
  />
);

const AppNavigator = ({ userData, updateUserProfileImage }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabsComponent}
        initialParams={{ userData, updateUserProfileImage }}
      />
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
      />
      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 