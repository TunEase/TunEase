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
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import Header from "../components/Form/header"; // Import the Header component

const Review: React.FC = () => {
  const navigation = useNavigation(); // Initialize the navigation hook
  const { user } = useAuth(); // Ensure this is called outside of any conditionals
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [helpfulCount, setHelpfulCount] = useState(4923);
  const [reviews, setReviews] = useState<any[]>([]);

  const handleSubmit = () => {
    if (reviewText.trim()) {
      const newReview = {
        rating,
        text: reviewText,
        name: user?.name || "Anonymous",
        date: new Date().toLocaleString(),
      };

      setReviews([newReview, ...reviews]);
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
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= item.rating ? "star" : "star-o"}
            size={18}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reviews"
        showBackButton={true}
        onBack={() => navigation.goBack()} // Use navigation.goBack() to handle back action
      />
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
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
            <Text style={styles.helpfulText}>
              {helpfulCount} found this helpful
            </Text>
          </View>
        }
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item, index) => index.toString()}
        style={styles.reviewList}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  helpfulText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  reviewList: {
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  reviewContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00796B",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
});

export default Review;
