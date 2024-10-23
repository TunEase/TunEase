import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { supabase } from "../services/supabaseClient";

const ManageFeesScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId, serviceName } = route.params;
  const [fees, setFees] = useState<
    { id: string; name: string; fee: number; description: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFee, setCurrentFee] = useState<any>(null);

  const fetchFees = async () => {
    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching fees:", error);
    } else {
      setFees(data);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [serviceId]);

  const handleEditFee = (fee: any) => {
    setCurrentFee(fee);
    setModalVisible(true);
  };

  const handleSaveFee = async () => {
    if (currentFee.id) {
      // Update existing fee
      const { error } = await supabase
        .from("fees")
        .update({
          name: currentFee.name,
          fee: currentFee.fee,
          description: currentFee.description,
        })
        .eq("id", currentFee.id);

      if (error) {
        console.error("Error updating fee:", error);
      }
    } else {
      // Add new fee
      const { error } = await supabase.from("fees").insert([
        {
          name: currentFee.name,
          fee: currentFee.fee,
          description: currentFee.description,
          service_id: serviceId,
        },
      ]);

      if (error) {
        console.error("Error adding fee:", error);
      }
    }

    setModalVisible(false);
    fetchFees();
  };

  const handleAddFee = () => {
    setCurrentFee({ name: "", fee: 0, description: "" });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.serviceName}>{serviceName}</Text>
      <FlatList
        data={fees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.feeItem}
            onPress={() => handleEditFee(item)}
          >
            <View style={styles.feeTextContainer}>
              <Text style={styles.feeName}>{item.name}</Text>
              <Text style={styles.feeDate}>24/nov/2023</Text>
            </View>
            <Text style={styles.feeAmount}>${item.fee.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddFee}>
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
            {currentFee?.id ? "Edit Fee" : "Add Fee"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Fee Name"
            value={currentFee?.name}
            onChangeText={(text) =>
              setCurrentFee({ ...currentFee, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Fee Amount"
            value={currentFee?.fee.toString()}
            onChangeText={(text) =>
              setCurrentFee({ ...currentFee, fee: parseFloat(text) })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={currentFee?.description}
            onChangeText={(text) =>
              setCurrentFee({ ...currentFee, description: text })
            }
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSaveFee}
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
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  feeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  feeTextContainer: {
    flexDirection: "column",
  },
  feeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  feeDate: {
    fontSize: 12,
    color: "#888",
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
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

export default ManageFeesScreen;
