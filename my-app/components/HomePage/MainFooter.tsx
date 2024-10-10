import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  UserProfile: undefined; // Define your route here
  // ... other routes ...
  Login: undefined;
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
   
    <View style={styles.footerContainer}>
    
       <TouchableOpacity >
         <FontAwesome5 name="home"  size={24} color="" />
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
       <TouchableOpacity onPress={() => navigation.navigate('Login')}>  
         <FontAwesome5 name="sign-out-alt" size={24} color="#007bff" />
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
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#1D242B",
    marginTop: 5,
  },
});