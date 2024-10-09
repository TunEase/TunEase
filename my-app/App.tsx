import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AppNavigator from "./AppNavigation";
import CategoryDetails from "./components/HomePage/CategoryDetails";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
          name="navigation"
          component={AppNavigator}
          initialParams={{ category: "Baladia" }}
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