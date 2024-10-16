import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthContext } from "../components/AuthContext";
import { supabase } from "../services/supabaseClient";

type Business = {
  id: string;
  name: string;
  description: string;
  address: string;
  business_type: string;
  phone: string;
  email: string;
  website: string;
  established_year: number;
};

const BusinessProfileApp: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        if (!user) {
          setError("User is not logged in");
          return;
        }
        const { data, error } = await supabase
          .from("business")
          .select(
            `*,
          services(*),
          media(*),
          reviews(
            *,
            user_profile(*)
          )
        `
          )
          .eq("manager_id", user.id)
          .single();
        if (error) {
          setError(error.message);
        } else {
          setBusiness(data);
          // Start the animation when the business data is fetched
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00796B" />; // Loading indicator color set to teal
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No business found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Business Profile</Text>

      <Animated.View style={[styles.card, { opacity: animation }]}>
        <Text style={styles.title}>{business.name}</Text>
        <Text style={styles.description}>{business.description}</Text>

        <View style={styles.detailContainer}>
          <Feather name="map-pin" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.info}>{business.address}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="briefcase" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.info}>{business.business_type}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="phone" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.info}>{business.phone}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="mail" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>{business.email}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="globe" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Website</Text>
            <Text
              style={[styles.info, styles.link]}
              onPress={() => Linking.openURL(business.website)}
            >
              {business.website}
            </Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="calendar" size={24} color="#00796B" />
          {/* Icon color set to teal */}
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Established Year</Text>
            <Text style={styles.info}>{business.established_year}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("BusinessProfile" as never)}
        >
          <Feather name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default BusinessProfileApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2", // Background color set to light gray
  },
  card: {
    backgroundColor: "#FFFFFF", // White background for the card
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#D1D1D1", // Changed to a lighter gray border for the card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00796B", // Header color set to teal
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00796B", // Title color set to teal
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#444444", // Dark gray for description
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222222", // Dark gray
    marginTop: 5,
  },
  info: {
    fontSize: 14,
    color: "#444444", // Medium gray for info
  },
  link: {
    color: "#00796B", // Link color set to teal
    textDecorationLine: "underline",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#E3F2FD", // Light blue background for detail containers
    borderWidth: 1,
    borderColor: "#BBDEFB", // Light blue border for details
  },
  detailTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  settingsButton: {
    backgroundColor: "#00796B", // Button background set to teal
    borderRadius: 50,
    padding: 15,
    alignSelf: "flex-end",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#D32F2F", // Red for error messages
    fontSize: 20,
  },
});
