import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BookingCardProps {
  date: string;
  time: string;
  serviceName: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  date,
  time,
  serviceName,
}) => {
  // Format the date
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.detail}>Service: {serviceName}</Text>
      <Text style={styles.detail}>Date: le {formattedDate}</Text>
      <Text style={styles.detail}>Time: {time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BookingCard;
