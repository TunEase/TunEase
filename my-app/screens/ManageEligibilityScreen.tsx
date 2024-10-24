import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { supabase } from "../services/supabaseClient";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome from @expo/vector-icons

const ManageEligibilityScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId } = route.params;
  const [eligibilities, setEligibilities] = useState<
    {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEligibility, setCurrentEligibility] = useState<any>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchEligibilities();
  }, []);

  const fetchEligibilities = async () => {
    const { data, error } = await supabase
      .from("eligibility")
      .select("id, name, description, created_at, updated_at") // Include created_at and updated_at
      .eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching eligibilities:", error);
    } else {
      setEligibilities(data);
    }
  };

  const handleAddEligibility = () => {
    setCurrentEligibility({ name: "", description: "" });
    setModalVisible(true);
  };

  const handleEditEligibility = (eligibility: any) => {
    setCurrentEligibility(eligibility);
    setModalVisible(true);
  };

  const handleSaveEligibility = async () => {
    if (currentEligibility.id) {
      // Update existing eligibility
      const { error } = await supabase
        .from("eligibility")
        .update({
          name: currentEligibility.name,
          description: currentEligibility.description,
        })
        .eq("id", currentEligibility.id);

      if (error) {
        console.error("Error updating eligibility:", error);
      }
    } else {
      // Add new eligibility
      const { error } = await supabase.from("eligibility").insert([
        {
          name: currentEligibility.name,
          description: currentEligibility.description,
          service_id: serviceId,
        },
      ]);

      if (error) {
        console.error("Error adding eligibility:", error);
      }
    }

    setModalVisible(false);
    fetchEligibilities();
  };

  const handleUploadImage = (eligibilityId: string) => {
    // Toggle the expanded state of the card
    setExpandedCardId(expandedCardId === eligibilityId ? null : eligibilityId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Eligibility</Text>
      <FlatList
        data={eligibilities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eligibilityItem}>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleUploadImage(item.id)}>
                <FontAwesome name="cloud-upload" size={20} color="#00796B" />
              </TouchableOpacity>
            </View>
            <View style={styles.eligibilityTextContainer}>
              <Text style={styles.eligibilityName}>{item.name}</Text>
              <Text style={styles.eligibilityDescription}>
                {item.description}
              </Text>
              <Text style={styles.eligibilityDate}>
                Created: {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <Text style={styles.eligibilityDate}>
                Updated: {new Date(item.updated_at).toLocaleDateString()}
              </Text>
              {expandedCardId === item.id && (
                <View style={styles.imageUploadSection}>
                  <Text style={styles.uploadText}>Upload Image Section</Text>
                  {/* Add your image upload logic here */}
                </View>
              )}
            </View>
            <TouchableOpacity onPress={() => handleEditEligibility(item)}>
              <FontAwesome name="edit" size={20} color="#00796B" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddEligibility}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        animationInTiming={800}
        animationOutTiming={800}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {currentEligibility?.id ? "Edit Eligibility" : "Add Eligibility"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Eligibility Name"
            value={currentEligibility?.name}
            onChangeText={(text) =>
              setCurrentEligibility({ ...currentEligibility, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Eligibility Description"
            value={currentEligibility?.description}
            onChangeText={(text) =>
              setCurrentEligibility({
                ...currentEligibility,
                description: text,
              })
            }
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveEligibility}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  eligibilityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  eligibilityTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  eligibilityName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eligibilityDescription: {
    fontSize: 14,
    color: "#555",
  },
  eligibilityDate: {
    fontSize: 12,
    color: "#888",
  },
  imageUploadSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  uploadText: {
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#00796B",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#00796B",
  },
  cancelButton: {
    backgroundColor: "#FF5252",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageEligibilityScreen;
