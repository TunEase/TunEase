import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import ButtonStyles from "../components/Form/Button";
import Header from "../components/HomePage/Banner";
import Categories from "../components/HomePage/Categories";
import Footer from "../components/HomePage/MainFooter";
import Notification from "../components/HomePage/Notification";

const user = {
  isLoggedIn: true,
  name: "chayma",
};

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Text style={styles.welcomeText}>
          {user.isLoggedIn ? `Welcome , ${user.name}!` : "Welcome User"}
        </Text>
        <Categories navigation={navigation} />
        <TouchableOpacity style={ButtonStyles.primaryButton}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Book a New Appointment</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <Notification />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Light blue background
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF", // White background for content
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#0D47A1", // Medium blue for text
    marginVertical: 15,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#0D47A1", // Medium blue button
    paddingHorizontal: 25,
    borderRadius: 30,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaText: {
    fontSize: 18,
    color: "#FFFFFF", // White text on buttons
    fontWeight: "700",
  },
});
