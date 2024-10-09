import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/HomePage/Banner";
import Categories from "../components/HomePage/Categories";
import Footer from "../components/HomePage/MainFooter";
import Notification from "../components/HomePage/Notification";

const user = {
  isLoggedIn: true,
  name: "chayma",
};

const Home: React.FC = (navigation) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        {/* App Header */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {/* User-specific Greeting */}
        <Text style={styles.header}>
          {user.isLoggedIn ? `Welcome, ${user.name}` : "Welcome User"}
        </Text>
        {/* Service Categories */}
        <Categories navigation={navigation} />
        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => {}}>
          <Text style={styles.ctaText}>Book a New Appointment</Text>
        </TouchableOpacity>
        {/* Notifications */}
        <Notification />
      </SafeAreaView>

      {/* Footer */}
      <Footer />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
  },

  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
  },
  ctaButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 20,
  },
  ctaText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
