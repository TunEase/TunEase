import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../my-app/screens/HomePage";
import CategoryDetails from "./components/HomePage/CategoryDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


