import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuthContext } from "../components/AuthContext";
import { supabase } from "../services/supabaseClient"; // Ensure you import your supabase client

const EditProfileScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { user } = useAuthContext();
  const [businessName, setBusinessName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [establishedYear, setEstablishedYear] = useState<string>("");

  // Fetch existing business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("business")
        .select("*")
        .eq("manager_id", user.id)
        .single();

      if (error) {
        Alert.alert("Error fetching business data", error.message);
      } else if (data) {
        setBusinessName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setDescription(data.description);
        setType(data.business_type);
        setWebsite(data.website);
        setEstablishedYear(data.established_year.toString());
      }
    };

    fetchBusinessData();
  }, [user]);

  const handleSubmit = async () => {
    if (
      !businessName ||
      !email ||
      !phone ||
      !address ||
      !type ||
      !website ||
      !establishedYear
    ) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const profileData = {
      name: businessName,
      email,
      phone,
      address,
      description,
      business_type: type,
      website,
      established_year: parseInt(establishedYear), // Convert to number
    };

    const { error } = await supabase
      .from("business")
      .update(profileData)
      .eq("manager_id", user.id); // Ensure to update based on the correct identifier

    if (error) {
      Alert.alert("Error updating profile", error.message);
    } else {
      console.log("Updated Profile:", profileData);
      navigation.navigate("BusinessProfile"); // Navigate back after successful update
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        placeholderTextColor="#666"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#666"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#666"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        placeholderTextColor="#666"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#666"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Website"
        placeholderTextColor="#666"
        keyboardType="url"
        value={website}
        onChangeText={setWebsite}
      />
      <TextInput
        style={styles.input}
        placeholder="Established Year"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={establishedYear}
        onChangeText={setEstablishedYear}
      />

      <TouchableOpacity style={styles.ctaButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  ctaButton: {
    backgroundColor: "#00796B",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;
