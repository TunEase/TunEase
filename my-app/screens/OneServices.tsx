import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { Service } from "../types/business";

const OneServices: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { businessId } = route.params;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          media:media(service_id, media_url),
          reviews:reviews(*, media:media(review_id, media_url),user_profile:user_profile(*, media:media(media_url)))
        `
        )
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
      <FlatList
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <Text style={styles.header}>Services Offered</Text>
        }
        data={services}
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <Image
              source={{
                uri: item.media[Math.floor(Math.random() * item.media.length)]
                  .media_url,
              }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate("ServiceDetails", {
                  serviceId: item.id,
                })
              }
            >
              <Text style={styles.viewButtonText}>View Service</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.noServicesText}>No services found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default OneServices;

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
  serviceImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
