import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Text } from "react-native";
import { supabase } from "../services/supabaseClient";


const CreateServiceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '', reordering: 'CUSTOM', business_id: '', service_type: 'PUBLIC' });
  const [modalVisible, setModalVisible] = useState(true);

  const handleModalSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([newService]);

      if (error) throw error;
      console.log("Service added:", data);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding service:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Your Service</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={newService.name}
              onChangeText={(text) => setNewService({ ...newService, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Description"
              value={newService.description}
              onChangeText={(text) => setNewService({ ...newService, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Price"
              keyboardType="numeric"
              value={newService.price}
              onChangeText={(text) => setNewService({ ...newService, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              keyboardType="numeric"
              value={newService.duration}
              onChangeText={(text) => setNewService({ ...newService, duration: text })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleModalSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
export default CreateServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
  },
  card: {
    width: '90%',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '80%', // Adjust width as needed
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
    elevation: 5,
    },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#00796B",
    marginBottom: 20,
    textAlign: 'center', // Center the input text
    marginTop: 20,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#F1F8E9",
    fontSize: 16,
    color: "#004D40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    textAlign: 'center', // Center the input text

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
    
    // Center the input text
  },
});

