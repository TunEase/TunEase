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
  Alert,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import MainFooter from "../components/HomePage/MainFooter";

const AllService: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
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
          media:media(service_id, media_url),
          reviews:reviews(service_id, rating)
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
      setVisibleCount((prevCount) => prevCount + 6);
      setLoadingMore(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleAddToFavorites = async (serviceId) => {
    console.log("User Profile:", user);
    if (!user) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_profile_id: user.id, service_id: serviceId }]);
      if (error) throw error;
      Alert.alert("Success", "Service added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Error", "Failed to add service to favorites.");
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
    <View style={styles.container}>
      <FlatList
        data={filteredServices.slice(0, visibleCount)}
        ListHeaderComponent={
          <>
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
          </>
        }
        renderItem={({ item }) => {
          const averageRating = calculateAverageRating(item.reviews);
          return (
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() =>
                navigation.navigate("ServiceDetails", {
                  serviceId: item.id,
                })
              }
            >
              {item.media && item.media.length > 0 && (
                <Image
                  source={{
                    uri: item.media[
                      Math.floor(Math.random() * item.media.length)
                    ].media_url,
                  }}
                  style={styles.serviceImage}
                />
              )}
              <Text style={styles.serviceName}>{item.name}</Text>
              <View style={styles.iconRow}>
                <Text style={styles.serviceRating}>
                  {`⭐ ${averageRating} (${item.reviews.length} Reviews)`}
                </Text>
                <TouchableOpacity onPress={() => handleAddToFavorites(item.id)}>
                  <FontAwesome
                    name="bookmark"
                    size={24}
                    color="#FF6347"
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.serviceDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          visibleCount < filteredServices.length ? (
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
          ) : null
        }
      />
      <MainFooter navigation={navigation} />
    </View>
  );
};

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
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  bookmarkIcon: {
    marginLeft: "auto",
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
  serviceRating: {
    fontSize: 14,
    color: "#666",
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
    marginHorizontal: 20,
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

export default AllService;
