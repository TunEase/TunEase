import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  UserProfile: undefined; // Existing route
  ProfileScreen: undefined; // Add this line
  Login: undefined; // Existing route
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity>
        <FontAwesome5 name="home" size={24} color="00796B" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="bell" size={24} color="#00796B" />
        <Text style={styles.footerText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
        <FontAwesome5 name="user" size={24} color="#00796B" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#00796B" />
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
    backgroundColor: "#F2F2F2",
    borderTopWidth: 1,
    borderTopColor: "#B0BEC5",
    paddingVertical: 12,
    elevation: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#1D242B",
    marginTop: 5,
  },
});
