import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  UserProfile: undefined; // Define your route here
  // ... other routes ...
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
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
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
        <FontAwesome5 name="user" size={24} color="#007bff" />   
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity>  
        <FontAwesome5 name="sign-out-alt" size={24} color="#007bff" />
        <Text style={styles.footerText}>Logout</Text>
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
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 10,
    color: "#007bff",
    textAlign: "center",
  },
});