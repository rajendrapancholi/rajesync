import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="sign-in" 
        options={{ 
          headerShown: true, 
          title: 'Login',
          headerTitleAlign: 'left',
          headerBackTitle: 'Back' //  for iOS
        }} 
      />
      <Stack.Screen 
        name="sign-up" 
        options={{ 
          headerShown: true, 
          title: 'Register',
          headerTitleAlign: 'left'
        }} 
      />
    </Stack>
  );
};

export default AuthLayout;
