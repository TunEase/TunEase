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
  TextInput,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { FontAwesome } from "@expo/vector-icons";

const AllService: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [services, setServices] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          media:media(service_id, media_url)
        `
        )
        .order("created_at", { ascending: false });
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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All Services</Text>
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={20}
          color="#333"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredServices.length === 0 ? (
        <Text style={styles.noServicesText}>No services found.</Text>
      ) : (
        <FlatList
          data={filteredServices.slice(0, visibleCount)} // Show only the visibleCount number of services
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              {item.media && item.media.length > 0 && (
                <Image
                  source={{
                    uri: item.media[
                      Math.floor(Math.random() * item.media.length)
                    ].media_url,
                  }} // Use a random media image
                  style={styles.serviceImage}
                />
              )}
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
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
      {visibleCount < filteredServices.length && ( // Show Load More button if there are more services
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMoreServices}
        >
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
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
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
    height: 250,
    maxWidth: "45%",
    alignItems: "center",
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
    textAlign: "center",
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
  searchIcon: {
    marginRight: 10,
  },
});
