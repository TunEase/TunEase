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

const ManageEligibilityScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId } = route.params;
  const [eligibilities, setEligibilities] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEligibility, setCurrentEligibility] = useState<any>(null);

  useEffect(() => {
    fetchEligibilities();
  }, []);

  const fetchEligibilities = async () => {
    const { data, error } = await supabase
      .from("eligibility")
      .select("*")
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Eligibility</Text>
      <FlatList
        data={eligibilities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eligibilityItem}
            onPress={() => handleEditEligibility(item)}
          >
            <Text style={styles.eligibilityName}>{item.name}</Text>
            <Text style={styles.eligibilityDescription}>
              {item.description}
            </Text>
          </TouchableOpacity>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eligibilityName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eligibilityDescription: {
    fontSize: 14,
    color: "#555",
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
