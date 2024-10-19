import React, { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.heading}>Service Settings</Text>

      {/* Disable Service */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Disable Service:</Text>
        <Switch
          value={isServiceDisabled}
          onValueChange={setIsServiceDisabled}
        />
      </View>

      {/* Availability */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Availability:</Text>
        <TextInput
          style={styles.input}
          value={availability}
          onChangeText={setAvailability}
        />
      </View>

      {/* Accept Complaints */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Accept Complaints:</Text>
        <Switch value={acceptComplaints} onValueChange={setAcceptComplaints} />
      </View>

      {/* Accept Appointments */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Accept Appointments:</Text>
        <Switch
          value={acceptAppointments}
          onValueChange={setAcceptAppointments}
        />
      </View>

      {/* Show Reviews */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Show Reviews:</Text>
        <Switch value={showReviews} onValueChange={setShowReviews} />
      </View>

      {/* Price */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Price ($):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price.toString()}
          onChangeText={(text) => setPrice(Number(text))}
        />
      </View>

      {/* Max Number of Appointments */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Max Appointments:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={maxAppointments.toString()}
          onChangeText={(text) => setMaxAppointments(Number(text))}
        />
      </View>

      {/* Auto-Confirmation */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Auto-Confirmation:</Text>
        <Switch value={autoConfirm} onValueChange={setAutoConfirm} />
      </View>

      {/* Staff Assignment */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Staff Assigned:</Text>
        <TextInput
          style={styles.input}
          value={staffAssigned}
          onChangeText={setStaffAssigned}
        />
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    width: "50%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
});

export default ServiceSettings;
