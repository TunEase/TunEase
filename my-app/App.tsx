import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import Home from "../my-app/screens/HomePage";
import BusinessProfile from "./components/Allbusiness/BusinessProfile";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Categories from "./components/HomePage/Categories";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import { useAuth } from "./hooks/useAuth";
import { insertSampleData } from "./services/supabaseClient";
import AllBusinesses from "./screens/AllBusinesses";
import AllServices from "./screens/OneServices";
import ServiceDetails from "./screens/ServiceDetails";
import Feedback from "./screens/Feedback";
import FAQs from "./screens/FAQs";
import Review from "./screens/Review";
import UserProfile from "./screens/UserProfile";

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
        <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
        <Stack.Screen name="AllBusinesses" component={AllBusinesses} />
        <Stack.Screen name="AllServices" component={AllServices} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
