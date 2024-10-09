import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import Home from "./screens/HomePage"; // Import Home here

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home} // Added Home screen here
          options={{ headerShown: false }} // Set options for Home
        />
        <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetails}
          initialParams={{ category: "Baladia" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
