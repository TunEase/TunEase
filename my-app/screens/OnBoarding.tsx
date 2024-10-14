import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

interface OnboardingProps {
  navigation: any;
}

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  // Sample data for each onboarding screen
  const onboardingData = [
    {
      title: "Welcome to TUNEASE Local Service Finder!",
      description: "Find the best businesses and services in your area with ease.",
      icon: "search",
    },
    {
      title: "Book Appointments Easily",
      description:
        "Schedule and manage your appointments quickly and effortlessly.",
      icon: "event-available",
    },
    {
      title: "Discover All Services",
      description: "Explore a wide range of services and businesses at your fingertips.",
      icon: "business",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Track the current onboarding screen

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // On the last screen, set onboarding completion and navigate to Home
      await AsyncStorage.setItem("onboardingCompleted", "true");
      navigation.replace("Home");
    }
  };

  return (
    <LinearGradient colors={['#004D40', '#00796B']} style={styles.mainContainer}>
      <SafeAreaView style={styles.screenContainer}>
        <Icon
          name={onboardingData[currentIndex].icon}
          size={100}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.title}>{onboardingData[currentIndex].title}</Text>
        <Text style={styles.description}>
          {onboardingData[currentIndex].description}
        </Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex < onboardingData.length - 1 ? "Next" : "Get Started"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#E0F7FA",
    textAlign: "center",
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: "#00796B",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
