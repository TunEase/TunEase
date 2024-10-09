import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import Home from "../my-app/screens/HomePage";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import Categories from "./components/HomePage/Categories";
import { insertSampleData } from "./services/supabaseClient";
import UserProfile from "./screens/UserProfile";

const Stack = createNativeStackNavigator();

export default function App() {
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
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


