import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface BookingCardProps {
  date: string;
  time: string;
  serviceName: string;
  businessName: string;
  userName: string;
  media: string;
  mediaBusiness: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  date,
  time,
  serviceName,
  businessName,
  userName,
  media,
  mediaBusiness,
}) => {
  // Format the date
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
  console.log("💀💀", businessName);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Booking Details</Text>
      <View style={styles.rows}>
        <Icon name="user" size={20} color="#333" />
        <Text style={styles.detail}> {userName}</Text>
      </View>
      <View style={styles.row}>
        <Image source={{ uri: media }} style={styles.circularImage} />
        <Text style={styles.detail}>{serviceName}</Text>
      </View>
      <View style={styles.row}>
        <Image source={{ uri: mediaBusiness }} style={styles.circularImage} />
        <Text style={styles.detail}>{businessName}</Text>
      </View>

      <Text style={styles.detail}>Date: le {formattedDate}</Text>
      <Text style={styles.detail}>Time: {time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rows: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width/height to make it circular
    marginRight: 10,
  },
  media: {
    width: 100,
    height: 100,
  },
  mediaBusiness: {
    width: 100,
    height: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  title: {
    fontSize: 20, // Increased font size for better visibility
    fontWeight: "bold",
    color: "#333", // Darker color for better contrast
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: "#555", // Slightly darker color for better readability
    // marginBottom: 5,
    fontWeight: "normal",
    // marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default BookingCard;
