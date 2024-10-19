import { Picker } from "@react-native-picker/picker";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const supabaseUrl =
  "https://supabase.com/dashboard/project/vjdfhinnbrgaxitnukmw/editor/51336?schema=public";
const supabaseAnonKey = "your-supabase-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the service data types
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  reordering: "CUSTOM" | "AUTOMATED";
  service_type: "PUBLIC" | "PRIVATE";
  disabled: boolean;
  accept_complaints: boolean;
  accept_appointments: boolean;
  show_reviews: boolean;
}

// Settings Component
const ServiceSettings = ({ services }: { services: string }) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchService();
  }, [services]);

  // Fetch service details from Supabase
  const fetchService = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", services)
      .single();

    if (error) {
      Alert.alert("Error", "Could not fetch service data.");
    } else {
      setService(data);
    }
    setLoading(false);
  };

  // Handle updates and saving the settings
  const updateService = async () => {
    if (!service) return;

    setLoading(true);
    const { error } = await supabase
      .from("services")
      .update({
        disabled: service.disabled,
        accept_complaints: service.accept_complaints,
        accept_appointments: service.accept_appointments,
        show_reviews: service.show_reviews,
        price: service.price,
        duration: service.duration,
        reordering: service.reordering,
        service_type: service.service_type,
      })
      .eq("id", service.id);

    if (error) {
      Alert.alert("Error", "Failed to update service.");
    } else {
      Alert.alert("Success", "Service updated successfully!");
    }
    setLoading(false);
  };

  if (loading || !service) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Settings: {service.name}</Text>

      {/* Disable Service */}
      <View style={styles.settingRow}>
        <Text>Disable Service</Text>
        <Switch
          value={service.disabled}
          onValueChange={(value) => setService({ ...service, disabled: value })}
        />
      </View>

      {/* Accept Complaints */}
      <View style={styles.settingRow}>
        <Text>Accept Complaints</Text>
        <Switch
          value={service.accept_complaints}
          onValueChange={(value) =>
            setService({ ...service, accept_complaints: value })
          }
        />
      </View>

      {/* Accept Appointments */}
      <View style={styles.settingRow}>
        <Text>Accept Appointments</Text>
        <Switch
          value={service.accept_appointments}
          onValueChange={(value) =>
            setService({ ...service, accept_appointments: value })
          }
        />
      </View>

      {/* Show Reviews */}
      <View style={styles.settingRow}>
        <Text>Show Reviews</Text>
        <Switch
          value={service.show_reviews}
          onValueChange={(value) =>
            setService({ ...service, show_reviews: value })
          }
        />
      </View>

      {/* Service Price */}
      <View style={styles.inputRow}>
        <Text>Service Price</Text>
        <TextInput
          style={styles.input}
          value={service.price.toString()}
          onChangeText={(value) =>
            setService({ ...service, price: parseFloat(value) })
          }
          keyboardType="numeric"
        />
      </View>

      {/* Service Duration */}
      <View style={styles.inputRow}>
        <Text>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={service.duration.toString()}
          onChangeText={(value) =>
            setService({ ...service, duration: parseInt(value, 10) })
          }
          keyboardType="numeric"
        />
      </View>

      {/* Reordering */}
      <View style={styles.inputRow}>
        <Text>Reordering</Text>
        <Picker
          selectedValue={service.reordering}
          onValueChange={(value) =>
            setService({
              ...service,
              reordering: value as "CUSTOM" | "AUTOMATED",
            })
          }
        >
          <Picker.Item label="Custom" value="CUSTOM" />
          <Picker.Item label="Automated" value="AUTOMATED" />
        </Picker>
      </View>

      {/* Service Type */}
      <View style={styles.inputRow}>
        <Text>Service Type</Text>
        <Picker
          selectedValue={service.service_type}
          onValueChange={(value) =>
            setService({
              ...service,
              service_type: value as "PUBLIC" | "PRIVATE",
            })
          }
        >
          <Picker.Item label="Public" value="PUBLIC" />
          <Picker.Item label="Private" value="PRIVATE" />
        </Picker>
      </View>

      {/* Save Button */}
      <Button
        title="Save Settings"
        onPress={updateService}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  inputRow: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
});

export default ServiceSettings;
