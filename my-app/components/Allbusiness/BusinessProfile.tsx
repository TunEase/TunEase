import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BusinessProfileProps {
  route: RouteProp<
    {
      params: {
        name: string;
        description: string;
        imageUrl: string;
        phoneNumber: string;
        email: string;
        address: string;
        businessType: string;
      };
    },
    "params"
  >;
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ route }) => {
  const {
    name,
    description,
    imageUrl,
    phoneNumber,
    email,
    address,
    businessType,
  } = route.params;

  const handleContactPress = () => {
    console.log("Contact pressed");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.businessType}>Business Type: {businessType}</Text>
      <Text style={styles.address}>Address: {address}</Text>
      <Text style={styles.contact}>Phone: {phoneNumber}</Text>
      <Text style={styles.contact}>Email: {email}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={handleContactPress} style={styles.button}>
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  businessType: {
    fontSize: 16,
    fontWeight: "600",

    marginBottom: 5,
    textAlign: "center",
  },
  address: {
    fontSize: 14,
    marginVertical: 5,
    textAlign: "center",
  },
  contact: {
    fontSize: 14,
    marginVertical: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginVertical: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BusinessProfile;
