import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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
  const { user } = useAuthContext();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the business data by ID
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        if (!user) {
          setError("User is not logged in");
          return;
        }
        console.log("user ", user);
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
        console.log("data business ", data);
        if (error) {
          setError(error.message);
        } else {
          setBusiness(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#00796B" />;
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
      <View style={styles.card}>
        <Text style={styles.title}>{business.name}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.info}>{business.description}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.info}>{business.address}</Text>

        <Text style={styles.label}>Type</Text>
        <Text style={styles.info}>{business.business_type}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.info}>{business.phone}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{business.email}</Text>

        <Text style={styles.label}>Website</Text>
        <Text
          style={[styles.info, styles.link]}
          onPress={() => Linking.openURL(business.website)}
        >
          {business.website}
        </Text>

        <Text style={styles.label}>Established Year</Text>
        <Text style={styles.info}>{business.established_year}</Text>
      </View>
    </ScrollView>
  );
};

export default BusinessProfileApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2", // Light gray background
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00796B", // Deep teal color for the header
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00796B", // Deep teal for business name
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B", // Teal color for labels
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: "#333", // Darker color for text information
    marginBottom: 10,
  },
  link: {
    color: "#00796B",
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 18,
  },
});
