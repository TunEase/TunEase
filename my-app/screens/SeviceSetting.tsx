import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

interface ServiceSettingsProps {}

const ServiceSettings: React.FC<ServiceSettingsProps> = () => {
  const [isServiceDisabled, setIsServiceDisabled] = useState<boolean>(false);
  const [availability, setAvailability] = useState<string>("9:00 AM - 5:00 PM");
  const [acceptComplaints, setAcceptComplaints] = useState<boolean>(true);
  const [acceptAppointments, setAcceptAppointments] = useState<boolean>(true);
  const [showReviews, setShowReviews] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(100);
  const [maxAppointments, setMaxAppointments] = useState<number>(10);
  const [autoConfirm, setAutoConfirm] = useState<boolean>(false);
  const [staffAssigned, setStaffAssigned] = useState<string>("John Doe");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Service Settings</Text>

      {/* Disable Service */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Disable Service</Text>
        <Switch
          value={isServiceDisabled}
          onValueChange={setIsServiceDisabled}
          trackColor={{ false: "#767577", true: "#00796B" }}
          thumbColor={isServiceDisabled ? "#fff" : "#00796B"}
        />
      </View>

      {/* Availability */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Availability</Text>
        <TextInput
          style={styles.input}
          value={availability}
          onChangeText={setAvailability}
          placeholder="Enter availability"
          placeholderTextColor="#a6a6a6"
        />
      </View>

      {/* Accept Complaints */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Accept Complaints</Text>
        <Switch
          value={acceptComplaints}
          onValueChange={setAcceptComplaints}
          trackColor={{ false: "#767577", true: "#00796B" }}
          thumbColor={acceptComplaints ? "#fff" : "#00796B"}
        />
      </View>

      {/* Accept Appointments */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Accept Appointments</Text>
        <Switch
          value={acceptAppointments}
          onValueChange={setAcceptAppointments}
          trackColor={{ false: "#767577", true: "#00796B" }}
          thumbColor={acceptAppointments ? "#fff" : "#00796B"}
        />
      </View>

      {/* Show Reviews */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Show Reviews</Text>
        <Switch
          value={showReviews}
          onValueChange={setShowReviews}
          trackColor={{ false: "#767577", true: "#00796B" }}
          thumbColor={showReviews ? "#fff" : "#00796B"}
        />
      </View>

      {/* Price */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price.toString()}
          onChangeText={(text) => setPrice(Number(text))}
          placeholder="Enter price"
          placeholderTextColor="#a6a6a6"
        />
      </View>

      {/* Max Number of Appointments */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Max Appointments</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={maxAppointments.toString()}
          onChangeText={(text) => setMaxAppointments(Number(text))}
          placeholder="Enter max appointments"
          placeholderTextColor="#a6a6a6"
        />
      </View>

      {/* Auto-Confirmation */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Auto-Confirmation</Text>
        <Switch
          value={autoConfirm}
          onValueChange={setAutoConfirm}
          trackColor={{ false: "#767577", true: "#00796B" }}
          thumbColor={autoConfirm ? "#fff" : "#00796B"}
        />
      </View>

      {/* Staff Assignment */}
      <View style={styles.settingCard}>
        <Text style={styles.label}>Staff Assigned</Text>
        <TextInput
          style={styles.input}
          value={staffAssigned}
          onChangeText={setStaffAssigned}
          placeholder="Enter staff name"
          placeholderTextColor="#a6a6a6"
        />
      </View>
    </ScrollView>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8", // Soft background
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B", // Primary color for the heading
    textAlign: "center",
    marginBottom: 25,
  },
  settingCard: {
    backgroundColor: "#fff", // White card background
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18, // Larger text for better readability
    fontWeight: "600",
    color: "#00796B", // Primary color for labels
  },
  input: {
    width: "50%",
    padding: 10,
    borderColor: "#00796B", // Primary color for input borders
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#333", // Text color
  },
});

export default ServiceSettings;
