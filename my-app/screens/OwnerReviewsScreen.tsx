import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import Icon from "react-native-vector-icons/MaterialIcons";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  isVisible: boolean; // New property to track visibility
};

const OwnerReviewsScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId } = route.params;
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at")
        .eq("service_id", serviceId);

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        // Initialize each review with isVisible set to true
        const initializedData = data.map((review: any) => ({
          ...review,
          isVisible: true,
        }));
        setReviews(initializedData);
      }
    };

    fetchReviews();
  }, [serviceId]);

  const toggleVisibility = (id: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, isVisible: !review.isVisible } : review
      )
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              size={20}
              color={index < item.rating ? "#FFD700" : "#E0E0E0"}
            />
          ))}
        </View>
        <TouchableOpacity onPress={() => toggleVisibility(item.id)}>
          <Icon
            name={item.isVisible ? "visibility" : "visibility-off"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {item.isVisible && (
        <>
          <Text style={styles.comment}>{item.comment}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReview}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  reviewItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});

export default OwnerReviewsScreen;
