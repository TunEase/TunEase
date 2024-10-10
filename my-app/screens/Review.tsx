import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../hooks/useAuth";

const Review: React.FC = () => {
  const { user } = useAuth();
  console.log("current user", user);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [helpfulCount, setHelpfulCount] = useState(4923);
  const [reviews, setReviews] = useState<any[]>([]);

  const handleSubmit = () => {
    if (reviewText.trim()) {
      const newReview = {
        rating,
        text: reviewText,
        name: user?.name,
        date: new Date().toLocaleString(),
      };

      setReviews([newReview, ...reviews]);
      console.log("Review submitted:", newReview);
      setRating(0);
      setReviewText("");
    }
  };

  const renderReview = ({
    item,
  }: {
    item: {
      rating: number;
      text: string;
      name: string;
      date: string;
    };
  }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= item.rating ? "star" : "star-o"}
            size={20}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Write a Review</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Icon
              name={star <= rating ? "star" : "star-o"}
              size={30}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
      <Text style={styles.helpfulText}>{helpfulCount} found this helpful</Text>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item, index) => index.toString()}
        style={styles.reviewList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  helpfulText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  reviewList: {
    marginTop: 20,
  },
  reviewContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewText: {
    fontSize: 16,
    color: "#333",
  },
  userName: {
    fontSize: 14,
    color: "#00796B",
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});

export default Review;
