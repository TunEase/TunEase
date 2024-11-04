import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

interface BusinessProfileProps {
  businessId: number;
}
type RootStackParamList = {
  UpdateQA: { businessId: number };
  AppointmentSettings: { businessId: string };
  EditProfileScreen: { businessId: number };
  Statistics: { businessId: string };
  AddService: { businessId: number }; // Add this line

};

const BusinessProfile: React.FC<BusinessProfileProps> = ({ businessId }) => {
  const [business, setBusiness] = useState<any>(null);
  const [servicesEnabled, setServicesEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!businessId) {
        console.error("Business ID is undefined");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("business")
        .select("*")
        .eq("id", businessId)
        .single();
      if (error) {
        console.error("Error fetching business profile:", error);
      } else {
        setBusiness(data);
        setServicesEnabled(data.services_enabled);
      }
      setLoading(false);
    };
    fetchBusinessProfile();
  }, [businessId]);

  const toggleServices = async () => {
    setServicesEnabled((prev) => !prev);
    await supabase
      .from("business")
      .update({ services_enabled: !servicesEnabled })
      .eq("id", businessId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Setting Profile</Text>

        {/* Services Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Services Enabled</Text>
          <Switch value={servicesEnabled} onValueChange={toggleServices} />
        </View>

        {/* Appointment Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Appointment Settings</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("AppointmentSettings", {
                businessId: String(businessId),
              })
            }
          >
            <Text style={styles.buttonText}>Update Appointment Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Q&A Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Q&A</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("UpdateQA", { businessId })}
          >
            <Text style={styles.buttonText}>Update Q&A</Text>
          </TouchableOpacity>
        </View>

        {/* View Services */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Services</Text>
          <TouchableOpacity
           style={styles.button}
           onPress={() =>
           navigation.navigate("AddService", {
           businessId: businessId,
    })
  }
>
  <Text style={styles.buttonText}>View Services</Text>
</TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Statistics</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Statistics", {
                businessId: String(businessId),
              })
            }
          >
            <Text style={styles.buttonText}>View Statistics</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("EditProfileScreen", { businessId })
          }
        >
          <Text style={styles.buttonText}>Edit Business Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1", // A light teal background for a softer feel
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // Extra padding for scrolling
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#004D40", // Darker teal for contrast
    marginBottom: 30,
    textAlign: "center",
    textTransform: "uppercase", // Adding uppercase for emphasis
    letterSpacing: 2, // Add a bit of spacing between letters
  },
  section: {
    marginBottom: 25, // Extra spacing for better readability
    backgroundColor: "#FFFFFF", // White background for sections
    borderRadius: 10, // Smooth rounded corners
    padding: 15,
    shadowColor: "#000", // Soft shadow for depth
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2, // Shadow on Android
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#004D40",
    marginBottom: 8,
    textTransform: "capitalize", // Make the headers a bit more elegant
  },
  text: {
    fontSize: 16,
    color: "#4F4F4F", // Dark gray for better readability
    marginBottom: 5,
    lineHeight: 22, // Add more spacing between lines for readability
  },
  button: {
    backgroundColor: "#004D40", // A slightly deeper teal for a modern touch
    paddingVertical: 12, // More padding for the buttons
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded buttons for a more modern look
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  switchWrapper: {
    flexDirection: "row", // Put text and switch on the same row
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    color: "#4F4F4F",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#004D40",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  footerText: {
    fontSize: 14,
    color: "#757575", // Light gray for footer text
    textAlign: "center",
    marginTop: 20,
  },
  
});
