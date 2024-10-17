import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const AllService: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const [services, setServices] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); 
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*");
      if (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again later.");
      } else {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const loadMoreServices = async () => {
    if (visibleCount < services.length) {
      setLoadingMore(true);
      setVisibleCount((prevCount) => prevCount + 6); // Load 6 more services
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00796B" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All Services</Text>
      {services.length === 0 ? (
        <Text style={styles.noServicesText}>No services found.</Text>
      ) : (
        <FlatList
          data={services.slice(0, visibleCount)} // Show only the visibleCount number of services
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image
                source={{ uri: item.imageUrl }} // Assuming you have an imageUrl field
                style={styles.serviceImage}
              />
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>
                {item.description}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("ServiceDetails", {
                      serviceId: item.id,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
      {visibleCount < services.length && ( // Show Load More button if there are more services
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreServices}>
          {loadingMore ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default AllService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
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
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    maxWidth: "45%",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  loadMoreButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});