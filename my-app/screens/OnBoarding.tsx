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

interface OnboardingProps {
  navigation: any;
}

const OnboardingScreens: React.FC<OnboardingProps> = ({ navigation }) => {
  // Sample data for each onboarding screen
  const onboardingData = [
    {
      title: "Welcome to Local Service Finder!",
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
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.screenContainer}>
        <Icon
          name={onboardingData[currentIndex].icon}
          size={100}
          color="#00796B"
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
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreens;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: "#00796B",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
