import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feedback from "./Feedback";
import Review from "./Review";
import FAQs from "./FAQs";

const { width } = Dimensions.get("window");

const ServiceDetails: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("About Me");

  const renderTabContent = () => {
    switch (activeTab) {
      case "About Me":
        return (
          <Text style={styles.tabContent}>
            Contrary to popular belief, lorem ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia.
          </Text>
        );
      case "Feedback":
        return <Feedback />;
      case "Reviews":
        return <Review />;
      case "FAQs":
        return <FAQs />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </View>
      <Image
        source={require("../assets/wzara.jpg")}
        style={styles.coverImage}
      />
      <View style={styles.profileContainer}>
        <Text style={styles.serviceName}>Plumbing Services</Text>
        <Text style={styles.serviceLocation}>
          2464 Royal Ln. Mesa, New Jersey 45463
        </Text>
        <Text style={styles.servicePrice}>$20/hr</Text>
        <Text style={styles.serviceRating}>⭐ 4.9 (120 Reviews)</Text>
      </View>
      <View style={styles.tabContainer}>
        {["About Me", "Feedback", "Reviews", "FAQs"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.complaintButton}>
          <Text style={styles.buttonText}>Raise a Complaint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  coverImage: {
    width: width,
    height: 200,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  serviceLocation: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    color: "#00796B",
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
  },
  tabContent: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  complaintButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 5,
  },
  bookButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceDetails;
