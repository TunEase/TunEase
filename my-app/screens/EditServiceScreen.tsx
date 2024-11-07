import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import * as Animatable from "react-native-animatable";

const EditServiceScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { serviceId } = route.params;
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [serviceImage, setServiceImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          media:media(service_id, media_url)
        `
        )
        .eq("id", serviceId)
        .single();

      if (error) {
        console.error("Error fetching service details:", error);
      } else {
        setServiceName(data.name);
        setServiceDescription(data.description);
        setPrice(data.price.toString());
        if (data.media && data.media.length > 0) {
          setServiceImage(data.media[0].media_url);
        }
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const toggleCard = (cardName: string) => {
    setExpandedCard((prevCard) => (prevCard === cardName ? null : cardName));
  };

  const handleSave = async () => {
    const updates = {
      name: serviceName,
      description: serviceDescription,
      price: parseFloat(price),
    };

    const { error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", serviceId);

    if (error) {
      console.error("Error updating service:", error);
    } else {
      console.log("Service updated successfully");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  const handdleShowMediaGallery = () => {
    navigation.navigate("MediaGalleryScreen", {
      type: "service",
      id: serviceId,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {serviceImage && (
        <Image source={{ uri: serviceImage }} style={styles.serviceImage} />
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{serviceName || "Loading..."}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            navigation.navigate("OwnerReviewsScreen", { serviceId })
          }
        >
          <FontAwesome
            name="star"
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>See Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            navigation.navigate("OwnerComplaintsScreen", { serviceId })
          }
        >
          <FontAwesome
            name="exclamation-circle"
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>See Complaints</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            navigation.navigate("ManageFeesScreen", { serviceId, serviceName })
          }
        >
          <FontAwesome
            name="money"
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Manage Fees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            navigation.navigate("ManageEligibilityScreen", {
              serviceId,
              serviceName,
            })
          }
        >
          <FontAwesome
            name="check"
            size={16}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Manage Eligibility</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("editService")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Edit Service Details</Text>
          <FontAwesome name="edit" size={20} color="#00796B" />
        </View>
        {expandedCard === "editService" && (
          <View style={styles.cardContent}>
            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={serviceName}
              onChangeText={setServiceName}
            />
            <TextInput
              style={styles.input}
              placeholder="Service Description"
              value={serviceDescription}
              onChangeText={setServiceDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Service Features"
              value={serviceFeatures}
              onChangeText={setServiceFeatures}
              multiline
            />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("availability")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Availability Settings</Text>
          <FontAwesome name="clock-o" size={20} color="#00796B" />
        </View>
        {expandedCard === "availability" && (
          <View style={styles.cardContent}>
            <TextInput
              style={styles.input}
              placeholder="Operating Hours"
              value={operatingHours}
              onChangeText={setOperatingHours}
            />
            <TextInput
              style={styles.input}
              placeholder="Set Capacity"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("priceUpdates")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Price Updates</Text>
          <FontAwesome name="dollar" size={20} color="#00796B" />
        </View>
        {expandedCard === "priceUpdates" && (
          <View style={styles.cardContent}>
            <TextInput
              style={styles.input}
              placeholder="Update Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={handdleShowMediaGallery}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Media Management</Text>
          <FontAwesome name="image" size={20} color="#00796B" />
        </View>
        {expandedCard === "mediaManagement" && (
          <View style={styles.cardContent}>
            <Text>Upload or update images/videos</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("serviceStatus")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Service Status</Text>
          <FontAwesome name="toggle-on" size={20} color="#00796B" />
        </View>
        {expandedCard === "serviceStatus" && (
          <View style={styles.cardContent}>
            <Text>
              Service is currently {isServiceActive ? "Active" : "Inactive"}
            </Text>
            <Switch
              value={isServiceActive}
              onValueChange={setIsServiceActive}
            />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("notificationSettings")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <FontAwesome name="bell" size={20} color="#00796B" />
        </View>
        {expandedCard === "notificationSettings" && (
          <View style={styles.cardContent}>
            <Text>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleCard("historyOfChanges")}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>History of Changes</Text>
          <FontAwesome name="history" size={20} color="#00796B" />
        </View>
        {expandedCard === "historyOfChanges" && (
          <View style={styles.cardContent}>
            <Text>View change history</Text>
            {/* Implement change history logic here */}
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackground}>
          <Animatable.View
            animation="bounceIn"
            duration={1500}
            style={styles.modalContainer}
          >
            <Text style={styles.modalText}>Saved!</Text>
          </Animatable.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F2F2F2",
  },
  serviceImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  topButton: {
    backgroundColor: "#00796B",
    borderRadius: 8,
    paddingVertical: 10,
    width: 150, // Fixed width for all buttons
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center", // Center content within the button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: "#00796B",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
  },
});

export default EditServiceScreen;
