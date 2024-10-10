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
    fontWeight: "700",
    marginBottom: 10,
    color: "#00796B",
    textAlign: "center",
  },
  notifications: {
    width: "85%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginVertical: 50,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  noNotificationText: {
    fontSize: 18,
    color: "#0D47A1",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
});
