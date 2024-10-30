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

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <Icon name="calendar" size={20} color="#00796B" />
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.row}>
        <Image source={{ uri: media }} style={styles.circularImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailTitle}>{serviceName}</Text>
          <Text style={styles.detailSubtitle}>{businessName}</Text>
          <Text style={styles.clientText}>Client: {userName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  circularImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detailSubtitle: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  clientText: {
    fontSize: 12,
    color: "#777",
  },
});

export default BookingCard;
