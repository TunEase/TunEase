import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabaseClient";

interface AppointmentSettingsProps {
  businessId: number;
}

const AppointmentSettings: React.FC<AppointmentSettingsProps> = ({
  businessId,
}) => {
  const [duration, setDuration] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSubmit = async () => {
    const { data, error } = await supabase.from("appointment_settings").upsert({
      business_id: businessId,
      duration,
      availability,
    });

    if (error) {
      console.error("Error updating appointment settings:", error);
    } else {
      console.log("Appointment settings updated successfully", data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Update Appointment Settings</Text>

      {/* Appointment Duration Input */}
      <Text style={styles.sectionHeader}>Appointment Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter duration (e.g., 30)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      {/* Availability Input */}
      <Text style={styles.sectionHeader}>
        Availability (e.g., Mon-Fri 9 AM - 5 PM)
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter availability"
        value={availability}
        onChangeText={setAvailability}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AppointmentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
