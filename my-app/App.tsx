import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Home from "../my-app/screens/HomeScreen";
import { AuthProvider } from "./components/AuthContext";
import Categories from "./components/HomePage/Categories";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import AllBusinesses from "./screens/AllBusinesses";
import AppointmentSettings from "./screens/AppointmentSettings";
import Login from "./screens/Auth/login";
import Signup from "./screens/Auth/signup";
import BusinessProfile from "./screens/BusinessProfile";
import BusinessProfileApp from "./screens/BusinessProfileApp";
import EditProfileScreen from "./screens/EditProfileScreen";
import FAQs from "./screens/FAQs";
import Feedback from "./screens/Feedback";
import EditServiceScreen from "./screens/EditServiceScreen";
import Review from "./screens/Review";

import Onboarding from "./screens/OnBoarding";

// import { insertFakeData } from "./services/supabaseClient";
import {
  OnBoardingScreen1,
  OnBoardingScreen2,
  OnBoardingScreen3,
  OnBoardingScreen4,
} from "./screens/OnBoarding2";
import ProfileScreen from "./screens/ProfileScreen";
import UsernameSettings from "./screens/UsernameSettings";
import ProfileSettings from "./screens/ProfileSettings";
// import { OnBoardingScreen1, OnBoardingScreen2,OnBoardingScreen3,OnBoardingScreen4 } from "./screens/OnBoarding2";
import Notification from "./screens/Notification";

import ComplaintsScreen from "./screens/ComplaintsScreen";
import OneServices from "./screens/OneServices";
import ServiceDetails from "./screens/ServiceDetails";
import ServiceSettings from "./screens/SeviceSetting";
import staticBusinessProfile from "./screens/staticBusinessProfile";
import Statistics from "./screens/Statistics";
import UpdateQA from "./screens/UpdateQ&A";
// import "./faker/index";
import { useAuth } from "./hooks/useAuth";
import AddService from "./screens/AddService";
import AllService from "./screens/AllService";
import Book from "./screens/Book";
import UserProfile from "./screens/UserProfile";

import OwnerComplaintsScreen from "./screens/OwnerComplaintsScreen";
import OwnerReviewsScreen from "./screens/OwnerReviewsScreen";
import ReplyToComplaintScreen from "./screens/ReplyToComplaintScreen";
import AvailabilityScreen from "./screens/AvailabilityScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const { user } = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const value = await AsyncStorage.getItem("onboardingCompleted");
      setIsOnboardingCompleted(value === "true");
    };
    checkOnboardingStatus();
  }, []);

  // useEffect(() => {
  //   const insertData = async () => {
  //     try {
  //       await insertFakeData();
  //       console.log("Sample data inserted successfully.");
  //     } catch (error) {
  //       console.error("Error inserting sample data:", error);
  //     }
  //   };

  //   insertData();
  // }, []);

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
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="staticBusinessProfile"
            component={staticBusinessProfile}
            options={{ headerShown: false }}
          />
          {/* Main Screens */}
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Categories"
            component={Categories}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllBusinesses"
            component={AllBusinesses}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllService"
            component={AllService}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ServiceDetails"
            component={ServiceDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnBoarding1"
            component={OnBoardingScreen1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnBoarding2"
            component={OnBoardingScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnBoardingScreen3"
            component={OnBoardingScreen3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OnBoardingScreen4"
            component={OnBoardingScreen4}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Feedback"
            component={Feedback}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FAQs"
            component={FAQs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Review"
            component={Review}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UsernameSettings"
            component={UsernameSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileSettings"
            component={ProfileSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OneServices"
            component={OneServices}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ComplaintsScreen"
            component={ComplaintsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BusinessProfile"
            component={BusinessProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateQA"
            component={UpdateQA}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddService"
            component={AddService}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BusinessProfileApp"
            component={BusinessProfileApp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppointmentSettings"
            component={AppointmentSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Statistics"
            component={Statistics}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditServiceScreen"
            component={EditServiceScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OwnerComplaintsScreen"
            component={OwnerComplaintsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OwnerReviewsScreen"
            component={OwnerReviewsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReplyToComplaintScreen"
            component={ReplyToComplaintScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AvailabilityScreen"
            component={AvailabilityScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ServiceSettings"
            component={ServiceSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Book"
            component={Book}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AuthProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
