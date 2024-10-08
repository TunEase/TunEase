import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity>
        <FontAwesome5 name="home" size={24} color="#007bff" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="heart" size={24} color="#007bff" />
        <Text style={styles.footerText}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="user" size={24} color="#007bff" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Footer;
const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0",
    borderTopColor: "#ccc",
  },
  footerText: {
    fontSize: 10,
    color: "#007bff",
  },
});
