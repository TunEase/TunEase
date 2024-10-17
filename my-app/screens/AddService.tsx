import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, Button, Alert, Modal } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this package is installed
import { supabase } from "../services/supabaseClient";

const AddService: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState({ name: '', description: '', imageUrl: '', price: '' });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showServices, setShowServices] = useState<boolean>(false);
  const [newServices, setNewServices] = useState<Record<string, { name: string; description: string; price: number; duration: string; reordering: string; service_type: string }>>({});
  const [showInputs, setShowInputs] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);

  const fetchServices = async (id: string) => {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        media:media(service_id, media_url)
      `)
      .eq("id", id);

    if (error) {
      console.error("Error fetching services:", error.message);
    } else {
      console.log("services", data);
      setServices(data);
    }
  };

  const addService = async () => {
    const { data, error } = await supabase
      .from("services")
      .insert([...selectedServices, { ...newService, id:"id" }]);
    setSelectedServices([...selectedServices, data]);

    if (error) {
      Alert.alert("Error adding service:", error.message);
    } else {
      Alert.alert("Service added successfully!");
      if (data) {
        setServices([...services, ...data]);
      }
      setShowForm(false);
      setNewService({ name: '', description: '', imageUrl: '', price: '' });
      fetchServices('your-service-id'); // Replace with the actual service ID
    }
  };

  const toggleInputs = (id: string) => {
    setCurrentServiceId(id);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    // Implement the logic to delete a service
    console.log("Deleting service with id:", id);
  };

  const handleModalSubmit = () => {
    // Implement the logic to handle form submission
    console.log("Submitting form for service id:", currentServiceId);
    setModalVisible(false);
  };

  useEffect(() => {
    if (services.length > 0) {
      const serviceId = services[0].id; // Use the first service's ID or adjust as needed
      fetchServices(serviceId);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.media[0].media_url }} style={styles.coverImage} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Rp.{item.price}k</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => toggleInputs(item.id)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Icon name="delete" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Service</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={currentServiceId ? newServices[currentServiceId]?.name || '' : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { ...prev[currentServiceId], name: text }
                }));
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={currentServiceId ? newServices[currentServiceId]?.description || '' : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { ...prev[currentServiceId], description: text }
                }));
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={currentServiceId ? String(newServices[currentServiceId]?.price || '') : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { 
                    ...prev[currentServiceId], 
                    price: parseFloat(text) // Convert string to number
                  }
                }));
              }
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Duration"
            value={currentServiceId ? newServices[currentServiceId]?.duration || '' : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { ...prev[currentServiceId], duration: text }
                }));
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Reordering"
            value={currentServiceId ? newServices[currentServiceId]?.reordering || '' : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { ...prev[currentServiceId], reordering: text }
                }));
              }
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Service Type"
            value={currentServiceId ? newServices[currentServiceId]?.service_type || '' : ''}
            onChangeText={(text) => {
              if (currentServiceId) {
                setNewServices(prev => ({
                  ...prev,
                  [currentServiceId]: { ...prev[currentServiceId], service_type: text }
                }));
              }
            }}
          />
          <Button title="Submit" onPress={handleModalSubmit} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#00796B",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  trashButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
});

export default AddService;