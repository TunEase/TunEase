import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const AllServices: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { businessId } = route.params;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", businessId);
      if (error) {
        console.error("Error fetching services:", error);
      } else {
        console.log("Fetched services:", data);
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, [businessId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Services Offered</Text>
        {services.length === 0 ? (
          <Text style={styles.noServicesText}>No services found.</Text>
        ) : (
          <FlatList
            data={services}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate("ServiceDetails", {
                    name: item.name,
                    description: item.description,
                    // Pass any other service properties you want to display
                  })
                }
              >
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceDescription}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#00796B",
    textAlign: "center",
    marginTop: 20,
  },
  noServicesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
  },
});
