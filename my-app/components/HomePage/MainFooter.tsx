import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  UserProfile: undefined;
  ProfileScreen: undefined;
  Login: undefined;
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity>
        <FontAwesome5 name="home" size={26} color="#00796B" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="bell" size={26} color="#00796B" />
        <Text style={styles.footerText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
        <FontAwesome5 name="user" size={26} color="#00796B" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <FontAwesome5 name="sign-out-alt" size={26} color="#00796B" />
        <Text style={styles.footerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FAFAFA", // Lighter background for modern feel
    borderTopWidth: 1,
    borderTopColor: "#B0BEC5",
    paddingVertical: 15,
    elevation: 5, // Subtle elevation to lift the footer off the screen slightly
  },
  footerText: {
    fontSize: 14, // Slightly larger font for readability
    color: "#004D40", // Softer dark color to match the icon color
    marginTop: 5,
  },
});
