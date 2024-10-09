import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      {[
        { icon: "home", label: "Home" },
        { icon: "bell", label: "Notification" },
        { icon: "user", label: "Profile" },
        { icon: "sign-out-alt", label: "Logout" },
      ].map(({ icon, label }, idx) => (
        <TouchableOpacity key={idx} style={styles.footerItem}>
          <FontAwesome5 name={icon} size={24} color="#3572EF" />
          <Text style={styles.footerText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E3F2FD",
    borderTopWidth: 1,
    borderTopColor: "#1D242B",
    paddingVertical: 10,
  },
  footerItem: {
    alignItems: "center",
    color: "#1D242B",
  },
  footerText: {
    fontSize: 12,
    color: "#1D242B",
    marginTop: 5,
  },
});
