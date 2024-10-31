import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { supabase } from "../../services/supabaseClient"; // Ensure supabaseClient is properly configured
// import { useAuth } from "../hooks/useAuth";
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from "../../components/Form/header";
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
    
    <Header
        title="Create Service"
        subtitle="Basic Information"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.fullScreenInput}
          placeholder="Service Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.fullScreenInput}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />
        <TextInput
          style={styles.fullScreenInput}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.fullScreenInput}
          placeholder="Duration (minutes)"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
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
  },
  headerContainer: {
    backgroundColor: "#004D40",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20, // Same padding as button container
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  backButton: {
    marginBottom: 10,
  },
  fullScreenInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: "#BDBDBD",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: "#004D40",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
});
export default CreateServiceScreen;

