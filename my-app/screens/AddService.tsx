import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const AddService: React.FC<{ route: any }> = ({ route }) => {
  const { businessId } = route.params;
  const [services, setServices] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newService, setNewService] = useState({ name: '', description: '', imageUrl: '', price: '' });

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const fetchServices = async () => {

    
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", "083fa7f5-3cfb-4896-98d8-8bf4a8365f68");

    if (error) {
      console.error("Error fetching services:", error.message);
      setError("Failed to load services. Please try again later.");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const addService = async () => {
    if (!businessId) {
      Alert.alert("Error", "Invalid business ID");
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .insert([{ ...newService, business_id: businessId }]);

    if (error) {
      Alert.alert("Error adding service:", error.message);
    } else {
      Alert.alert("Service added successfully!");
      if (data) {
        setServices([...services, ...data]);
      }
      setShowForm(false);
      setNewService({ name: '', description: '', imageUrl: '', price: '' });
    }
  };

  const loadMoreServices = async () => {
    if (visibleCount < services.length) {
      setLoadingMore(true);
      setVisibleCount((prevCount) => prevCount + 6);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00796B" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Services</Text>
      {services.length === 0 ? (
        <Text style={styles.noServicesText}>No services found.</Text>
      ) : (
        <FlatList
          data={services.slice(0, visibleCount)}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>
                {item.description}
              </Text>
              <Text style={styles.servicePrice}>Price: ${item.price}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
      {visibleCount < services.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreServices}>
          {loadingMore ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
      {showForm ? (
        <View style={styles.form}>
          <TextInput
            placeholder="Name"
            value={newService.name}
            onChangeText={(text) => setNewService({ ...newService, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newService.description}
            onChangeText={(text) => setNewService({ ...newService, description: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            value={newService.imageUrl}
            onChangeText={(text) => setNewService({ ...newService, imageUrl: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Price"
            value={newService.price}
            onChangeText={(text) => setNewService({ ...newService, price: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button title="Add Service" onPress={addService} />
          <Button title="Cancel" onPress={() => setShowForm(false)} color="red" />
        </View>
      ) : (
        <Button title="Add New Service" onPress={() => setShowForm(true)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  noServicesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    maxWidth: "45%",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00796B",
  },
  row: {
    justifyContent: "space-between",
  },
  loadMoreButton: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loadMoreText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00796B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#00796B',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddService;