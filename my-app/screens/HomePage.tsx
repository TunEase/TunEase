import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Header from "../components/HomePage/Banner";
import Categories from "../components/HomePage/Categories";
import Footer from "../components/HomePage/MainFooter";
import Notification from "../components/HomePage/Notification";

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Categories navigation={navigation} />
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Book a New Appointment</Text>
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
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#3572EF",
    marginVertical: 15,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#42A5F5",
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
