import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { supabase } from "../services/supabaseClient"; // Ensure supabaseClient is properly configured
// import { useAuth } from "../hooks/useAuth";
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const CreateServiceScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) =>{
  const { businessId,id} = route.params || {};

  // const { user } = useAuth();  // Use the user hook to get the user's details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); // State for media URL
  const [serviceType, setServiceType] = useState("PUBLIC");
  const [reordering, setReordering] = useState("CUSTOM");
  const isFormValid = name !== "" && price !== "" && duration !== "";


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
        media_url: mediaUrl, // Include media URL in the data
        reordering,
        service_type: serviceType,
        business_id: businessId,
      });

    if (error) {
      Alert.alert("Error adding service:", error.message);
    } else {
      Alert.alert("Service added successfully!"); 
      navigation.navigate('AddService');  // Go back to the AddService screen
    }
  };

  
  const handleNext = () => {
    // Define what should happen when the "Next" button is pressed
 if (isFormValid) {
  navigation.navigate('UploadMedia', { businessId, id });
 } else {
  Alert.alert("Please fill all required fields.");
 }
    // You can add navigation or other logic here
  };
  

  return (
    <View style={styles.container}>
        <View style={styles.card}>
      <Text style={styles.header}>Create a New Service</Text>

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
    
    </View>
    
  

      {/* Add the serviceType and reordering input options if necessary */}
      <View style={styles.buttonContainer}>
       <TouchableOpacity
        style={isFormValid ? styles.nextButton : styles.nextButtonDisabled}
        onPress={handleNext}
        disabled={!isFormValid}
      >
        <Text style={styles.nextButtonText}>Next</Text>
        
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: '90%',
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
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
  settingsButton: {
    backgroundColor: "#607D8B", // Example color
    borderRadius: 20, 
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  trashButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: { // Add this style
    color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "600",
  },
  header: {
    fontSize: 28, // Larger font size for emphasis
    fontWeight: "700", // Bolder weight
    marginBottom: 20,
    textAlign: "center",
    color: "#004D40", // Darker, richer color
    letterSpacing: 1.5,
    },
    input: {
      width: '100%',
  borderWidth: 1,
  borderColor: "#BDBDBD",
  padding: 12,
  marginBottom: 15,
  borderRadius: 10,
  backgroundColor: "#FAFAFA",
    },
    addButton: {
      backgroundColor: "#004D40", // Darker green for a richer look
  borderRadius: 10,
  paddingVertical: 15,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 3,
    },
    submitButton: { // Add this style
      backgroundColor: "#004D40",
  borderRadius: 10,
  paddingVertical: 15,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 3,
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "600",
    },
    mediaImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    inputWithButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    iconButton: {
      position: 'absolute',
      right: 5,
      top: 2.5,
      padding: 5,
      backgroundColor: "#00796B",
      marginLeft: -40,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 3,
    },
    iconButtonText: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "600",
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#BDBDBD",
      padding: 12,
      borderRadius: 10,
      backgroundColor: "#FAFAFA",
    },
    uploadBox: {
      width: '100%',
      height: 150,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f9f9f9",
    },
    placeholder: {
      alignItems: "center",
    },
    uploadIcon: {
      fontSize: 40,
      color: "#ccc",
    },
    uploadText: {
      fontSize: 14,
      color: "#666",
      marginTop: 10,
    },
    uploadSubtext: {
      fontSize: 12,
      color: "#999",
    },
    mediaPreview: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    nextButton: {
      backgroundColor: "#004D40",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: "center",
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    nextButtonDisabled: {
      backgroundColor: "#B0BEC5", // A lighter color to indicate disabled state
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: "center",
    },
  },
);

export default CreateServiceScreen;

