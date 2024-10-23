import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./screens/HomeScreen"

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;


