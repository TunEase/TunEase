import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../my-app/screens/HomeScreen";
import Login from "./screens/Auth/login";
import Signup from "./screens/Auth/signup";
import Categories from "./components/HomePage/Categories";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import AllBusinesses from "./screens/AllBusinesses";
import AllServices from "./screens/OneServices";
import UserProfile from "./screens/UserProfile";
import ServiceDetails from "./screens/ServiceDetails";
import Feedback from "./screens/Feedback";
import FAQs from "./screens/FAQs";
import Review from "./screens/Review";
import Onboarding from "./screens/OnBoarding";
import { useAuth } from "./hooks/useAuth";
import { insertFakeData } from "./services/supabaseClient";
import { OnBoardingScreen1,OnBoardingScreen2 } from "./screens/OnBoarding2" ;

const Stack = createNativeStackNavigator();


export default function App() {

  const { user } = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const value = await AsyncStorage.getItem("onboardingCompleted");
      setIsOnboardingCompleted(value === "true");
    };
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    const insertData = async () => {
      try {
        await insertFakeData();
        console.log("Sample data inserted successfully.");
      } catch (error) {
        console.error("Error inserting sample data:", error);
      }
    };

    insertData();
  }, []);

  // Handle loading state while checking onboarding status
  if (isOnboardingCompleted === null) {
    return null; // Or a loading spinner component
  }

  return (
    <NavigationContainer>
      <AuthProvider>
     <Stack.Navigator initialRouteName="Onboarding">
      {/* Onboarding */}
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />

        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />

        {/* Main Screens */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
        <Stack.Screen name="AllBusinesses" component={AllBusinesses} />
        <Stack.Screen name="AllServices" component={AllServices} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="OnBoarding1" component={OnBoardingScreen1} />
        <Stack.Screen name="OnBoarding2" component={OnBoardingScreen2} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="Review" component={Review} />
      </Stack.Navigator>
      <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  );
}
