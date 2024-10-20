import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "../services/supabaseClient"; // Ensure supabaseClient is properly configured
// import { useAuth } from "../hooks/useAuth";


const CreateService: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { businessId } = route.params;  // Retrieve business ID passed from AddService
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [serviceType, setServiceType] = useState("PUBLIC");
  const [reordering, setReordering] = useState("CUSTOM");

  const addNewService = async () => {
    if (!name || !price || !duration) {
      Alert.alert("All fields are required!");
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .insert({
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
        reordering,
        service_type: serviceType,
        business_id: businessId,
      });

    if (error) {
      Alert.alert("Error adding service:", error.message);
    } else {
      Alert.alert("Service added successfully!");
      navigation.goBack();  // Go back to the AddService screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cardContent}>Create a New Service</Text>

      <TextInput
        style={styles.input}
        placeholder="Service Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      {/* Add the serviceType and reordering input options if necessary */}
      
      <TouchableOpacity style={styles.addButton} onPress={addNewService}>
        <Text style={styles.addButtonText}>Add Service</Text>
        <Text style={styles.submitButtonText}>Submit</Text>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space evenly
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: "#00796B",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    width: 80,
    height: 80,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  settingsButton: {
    backgroundColor: "#607D8B", // Example color
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  availabilityButton: {
    backgroundColor: "#1E88E5", // Example color for availability
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButton: {
    backgroundColor: "#FFB300", // Example color for availability
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  trashButton: {
    backgroundColor: "#D32F2F", // Strong red for delete
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButtonText: { // Add this style
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },

});

export default CreateService;

