import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ServiceSettingsProps {
  serviceData: {
    isServiceDisabled: boolean;
    availability: string;
    acceptComplaints: boolean;
    acceptAppointments: boolean;
    showReviews: boolean;
    price: number;
    maxAppointments: number;
    autoConfirm: boolean;
    staffAssigned: string;
  };
  onSave: (updatedService: any) => void;
}

const ServiceSettings: React.FC<ServiceSettingsProps> = ({
  serviceData = {
    isServiceDisabled: false,
    availability: "",
    acceptComplaints: false,
    acceptAppointments: false,
    showReviews: false,
    price: 0,
    maxAppointments: 0,
    autoConfirm: false,
    staffAssigned: "",
  },
  onSave = () => {},
}) => {
  const [isServiceDisabled, setIsServiceDisabled] = useState<boolean>(
    serviceData.isServiceDisabled
  );
  const [availability, setAvailability] = useState<string>(
    serviceData.availability
  );
  const [acceptComplaints, setAcceptComplaints] = useState<boolean>(
    serviceData.acceptComplaints
  );
  const [acceptAppointments, setAcceptAppointments] = useState<boolean>(
    serviceData.acceptAppointments
  );
  const [showReviews, setShowReviews] = useState<boolean>(
    serviceData.showReviews
  );
  const [price, setPrice] = useState<number>(serviceData.price);
  const [maxAppointments, setMaxAppointments] = useState<number>(
    serviceData.maxAppointments
  );
  const [autoConfirm, setAutoConfirm] = useState<boolean>(
    serviceData.autoConfirm
  );
  const [staffAssigned, setStaffAssigned] = useState<string>(
    serviceData.staffAssigned
  );

  const handleSave = () => {
    const updatedService = {
      isServiceDisabled,
      availability,
      acceptComplaints,
      acceptAppointments,
      showReviews,
      price,
      maxAppointments,
      autoConfirm,
      staffAssigned,
    };
    onSave(updatedService);
  };

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
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      {/* <ServiceSettings serviceData={serviceData} onSave={handleSave} /> */}
    </ScrollView>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
