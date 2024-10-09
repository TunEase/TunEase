import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Notification: React.FC = () => {
  return (
    <ScrollView>
      <View style={styles.notifications}>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <Text style={styles.noNotificationText}>
          You have no new notifications.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#3572EF",
    textAlign: "center",
  },
  notifications: {
    width: "85%",
    padding: 20,
    backgroundColor: "#E3F2FD",
    borderRadius: 15,
    marginVertical: 50,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  noNotificationText: {
    fontSize: 18,
    color: "#3572EF",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
});
