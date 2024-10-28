import React, { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure this package is installed
import { supabase } from "../services/supabaseClient";

const AddService: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { id } = route.params || {};
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showServices, setShowServices] = useState<boolean>(false);
  const [newServices, setNewServices] = useState<
    Record<
      string,
      {
        name: string;
        description: string;
        price: number;
        duration: string;
        reordering: string;
        service_type: string;
      }
    >
  >({});

  const [showInputs, setShowInputs] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        *,
        media:media(service_id, media_url)
      `
      )
      .eq("business_id", id);

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
      .insert([...selectedServices, { ...newService, id: "id" }]);
    setSelectedServices([...selectedServices, data]);

    if (error) {
      Alert.alert("Error adding service:", error.message);
    } else {
      Alert.alert("Service added successfully!");
      if (data) {
        setServices([...services, ...data]);
      }
      setShowForm(false);
      setNewService({ name: "", description: "", imageUrl: "", price: "" });
      fetchServices(); // Use the last added service ID
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
    fetchServices();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.media[0].media_url }}
              style={styles.coverImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>Rp.{item.price}k</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => navigation.navigate("ServiceSettings")}
                >
                  <Icon name="settings" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.availabilityButton}
                  onPress={() => navigation.navigate("AvailabilityScreen",{serviceId:item.id})}
                >
                  <Icon name="check-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() =>
                    navigation.navigate("EditServiceScreen", {
                      serviceId: item.id,
                    })
                  }
                >
                  <Icon name="edit" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateButton} onPress={()=>navigation.navigate("AppointmentListScreen")}>
                  <Icon name="update" size={24} color="#FFFFFF" />
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
      <TouchableOpacity
        style={styles.addButton}
        onLongPress={() => navigation.navigate("CreateServiceScreen", { id: id })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  coverImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
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
    flexDirection: "row",
    justifyContent: "space-between", // Distribute space evenly
    alignItems: "center",
    marginTop: 10,
  },
  addButton: {
    position: "absolute",
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
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
});

export default AddService;
