import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Form/header"; // Import Header

const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from("favorites")
          .select(
            "service_id, services(*, media:media(service_id, media_url), reviews:reviews(service_id, rating))"
          )
          .eq("user_profile_id", user.id);
        if (error) {
          console.error("Error fetching favorites:", error);
        } else {
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const removeFavorite = async (serviceId: number) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("service_id", serviceId)
        .eq("user_profile_id", user.id);

      if (error) {
        console.error("Error removing favorite:", error);
      } else {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.service_id !== serviceId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Favorites"
        onBack={() => navigation.goBack()}
        showBackButton={true}
      />
      <View style={{ padding: 20 }}>
        <FlatList
          data={favorites}
          renderItem={({ item }) => {
            const service = item.services;
            const averageRating = calculateAverageRating(service.reviews);
            return (
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate("ServiceDetails", {
                    serviceId: service.id,
                  })
                }
              >
                {service.media && service.media.length > 0 && (
                  <Image
                    source={{ uri: service.media[0].media_url }}
                    style={styles.serviceImage}
                  />
                )}
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceRating}>
                  {`⭐ ${averageRating} (${service.reviews.length} Reviews)`}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFavorite(service.id)}
                >
                  <Icon name="remove" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.service_id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          key={2}
        />
      </View>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
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
    textAlign: "center",
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  removeButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#FF5252",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    justifyContent: "space-between",
  },
});
