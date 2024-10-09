import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./screens/HomePage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }} // This hides the navigation header
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
