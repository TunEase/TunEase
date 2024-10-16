import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ServicesSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.servicesRow}>
        <View style={styles.serviceItem}>
          <Ionicons name="briefcase-outline" size={24} color="#666" />
          <Text style={styles.serviceText}>Business</Text>
        </View>
        <View style={styles.serviceItem}>
          <Ionicons name="calendar-outline" size={24} color="#666" />
          <Text style={styles.serviceText}>Schedule</Text>
        </View>
      </View>
      <View style={styles.distanceContainer}>
        <Ionicons name="location-outline" size={20} color="#666" />
        <Text style={styles.distanceText}>2.3 km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  serviceItem: {
    alignItems: "center",
  },
  serviceText: {
    marginTop: 5,
    color: "#666",
  },
  distanceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 5,
    color: "#666",
  },
});

export default ServicesSection;
