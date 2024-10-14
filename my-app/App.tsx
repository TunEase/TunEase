import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import Home from "../my-app/screens/HomePage";
import { insertSampleData } from "../my-app/services/supabaseClient";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import Categories from "./components/HomePage/Categories";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import { useAuth } from "./hooks/useAuth";
import AllBusinesses from "./screens/AllBusinesses";
import AppointmentSettings from "./screens/AppointmentSettings";
import BusinessProfile from "./screens/BusinessProfile";
import EditProfileScreen from "./screens/EditProfileScreen";
import FAQs from "./screens/FAQs";
import Feedback from "./screens/Feedback";
import AllServices from "./screens/OneServices";
import Review from "./screens/Review";
import ServiceDetails from "./screens/ServiceDetails";
import Statistics from "./screens/Statistics";
import UpdateQA from "./screens/UpdateQ&A";
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
        <Stack.Screen name="AllBusinesses" component={AllBusinesses} />
        <Stack.Screen name="AllServices" component={AllServices} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
        <Stack.Screen name="UpdateQA" component={UpdateQA} />
        <Stack.Screen
          name="AppointmentSettings"
          component={AppointmentSettings}
        />
        <Stack.Screen name="Statistics" component={Statistics} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
