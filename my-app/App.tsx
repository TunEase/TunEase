import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Home from "../my-app/screens/HomePage";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import Categories from "./components/HomePage/Categories";
import { insertSampleData } from "./services/supabaseClient";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    const insertData = async () => {
      try {
        await insertSampleData();
        console.log("Sample data inserted successfully.");
      } catch (error) {
        console.error("Error inserting sample data:", error);
      }
    };

    insertData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
