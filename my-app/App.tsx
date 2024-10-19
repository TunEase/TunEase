import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Home from "../my-app/screens/HomeScreen";
import { AuthProvider } from "./components/AuthContext";
import Categories from "./components/HomePage/Categories";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import { useAuth } from "./hooks/useAuth";
import AllBusinesses from "./screens/AllBusinesses";
import AllServices from "./screens/AllService";
import AppointmentSettings from "./screens/AppointmentSettings";
import Login from "./screens/Auth/login";
import Signup from "./screens/Auth/signup";
import BusinessProfile from "./screens/BusinessProfile";
import BusinessProfileApp from "./screens/BusinessProfileApp";
import EditProfileScreen from "./screens/EditProfileScreen";
import FAQs from "./screens/FAQs";
import Feedback from "./screens/Feedback";
import Notification from "./screens/Notification";
import Onboarding from "./screens/OnBoarding";
import { OnBoardingScreen1, OnBoardingScreen2 } from "./screens/OnBoarding2";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileSettings from "./screens/ProfileSettings";
import Review from "./screens/Review";
import ServiceDetails from "./screens/ServiceDetails";
import Statistics from "./screens/Statistics";
import UpdateQA from "./screens/UpdateQ&A";
// import "./faker/index";
import AddService from "./screens/AddService";
import ServiceSettings from "./screens/SeviceSettingd";
import UserProfile from "./screens/UserProfile";
import UsernameSettings from "./screens/UsernameSettings";

const Stack = createNativeStackNavigator();

// import "./faker/index";

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
          <Stack.Screen name="AddService" component={AddService} />
          {/* <Stack.Screen name="ServiceDetails" component={ServiceDetails} /> */}
          {/* <Stack.Screen name="Feedback" component={Feedback} /> */}
          <Stack.Screen name="FAQs" component={FAQs} />
          <Stack.Screen name="Review" component={Review} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="UsernameSettings" component={UsernameSettings} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen
            name="BusinessProfileApp"
            component={BusinessProfileApp}
          />

          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen name="BusinessProfile" component={BusinessProfile} />
          <Stack.Screen name="UpdateQA" component={UpdateQA} />
          <Stack.Screen
            name="AppointmentSettings"
            component={AppointmentSettings}
          />
          <Stack.Screen name="Statistics" component={Statistics} />
          <Stack.Screen name="ServiceSettings" component={ServiceSettings} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  );
}
