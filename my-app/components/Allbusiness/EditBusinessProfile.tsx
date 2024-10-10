import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface EditBusinessProfileProps {
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
  navigation: any;
}

const EditBusinessProfile: React.FC<EditBusinessProfileProps> = ({
  route,
  navigation,
}) => {
  const {
    name: initialName,
    description: initialDescription,
    imageUrl: initialImageUrl,
    phoneNumber: initialPhoneNumber,
    email: initialEmail,
    address: initialAddress,
    businessType: initialBusinessType,
  } = route.params;

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);
  const [businessType, setBusinessType] = useState(initialBusinessType);

  const handleSave = () => {
    const updatedProfile = {
      name,
      description,
      imageUrl,
      phoneNumber,
      email,
      address,
      businessType,
    };

    console.log("Updated Profile:", updatedProfile);

    navigation.navigate("BusinessProfile", updatedProfile);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Business Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Business Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Type"
        value={businessType}
        onChangeText={setBusinessType}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#00796B",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditBusinessProfile;
