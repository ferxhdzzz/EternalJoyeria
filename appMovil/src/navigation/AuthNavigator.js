import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ onNavigateToProducts }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        initialParams={{ onNavigateToProducts }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        initialParams={{ onNavigateToProducts }}
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
      />
      <Stack.Screen 
        name="NewPassword" 
        component={NewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
