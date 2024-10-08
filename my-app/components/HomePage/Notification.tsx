import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Notification: React.FC = () => {
  return (
    <ScrollView>
      <View style={styles.notifications}>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <Text>You have no new notifications.</Text>
      </View>
    </ScrollView>
  );
};
export default Notification;
const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  notifications: {
    width: "100%",
    padding: 20,
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    marginVertical: 20,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 16,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
 
});