import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      {[
        { icon: "home", label: "Home" },
        { icon: "heart", label: "Favorites" },
        { icon: "user", label: "Profile" },
        { icon: "sign-out-alt", label: "Logout" },
      ].map(({ icon, label }, idx) => (
        <TouchableOpacity key={idx} style={styles.footerItem}>
          <FontAwesome5 name={icon} size={24} color="#FF6B6B" />
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
    backgroundColor: "#F5F5F5", // Light gray footer background
    borderTopWidth: 1,
    borderTopColor: "#B0BEC5", // Light border for separation
    paddingVertical: 10,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#1565C0", // Darker blue for footer text
    marginTop: 5,
  },
});
