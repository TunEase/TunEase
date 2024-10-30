import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { supabase } from "../services/supabaseClient";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome from @expo/vector-icons
import { Media } from "../types/business";
import ImageView from "react-native-image-viewing";
import Pdf from "react-native-pdf";
import { Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSupabaseUpload } from "../hooks/uploadFile";
import { useMedia } from "../hooks/useMedia";
const ManageFeesScreen: React.FC<{ route: any }> = ({ route }) => {
  const { insertMediaRecord, Mediaerror, MediaUploading } = useMedia();
  const { uploadMultipleFiles, fileUrls, uploadPdfFiles, error, uploading } =
    useSupabaseUpload("application");
  const { serviceId, serviceName } = route.params;
  const [fees, setFees] = useState<
    {
      id: string;
      name: string;
      fee: number;
      description: string;
      created_at: string;
      updated_at: string;
      media: Media[];
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFee, setCurrentFee] = useState<any>(null);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<{ uri: string }[]>([]);

  const handleUploadImage = async (feeId: string) => {
    const { urls } = await uploadMultipleFiles({ quality: 0.5 });
    console.log("urls", urls);
    insertMediaRecord(urls[0], "image", {
      fee_id: feeId,
    });
    fetchFees();
  };

  const fetchFees = async () => {
    const { data, error } = await supabase
      .from("fees")
      .select(
        "id, name, fee, description, created_at, updated_at, media (media_url,media_type)"
      )
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
    // Validate fee amount
    if (isNaN(currentFee.fee) || currentFee.fee === null) {
      console.error("Invalid fee amount");
      return;
    }

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

  const openImageViewer = (media: Media[], index: number) => {
    setImages(
      media
        .filter((m) => m.media_type === "image")
        .map((m) => ({ uri: m.media_url }))
    );
    setSelectedImageIndex(index);
    setImageViewVisible(true);
  };

  const openPDF = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open PDF:", err)
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.serviceName}>{serviceName}</Text>
      <FlatList
        data={fees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feeItem}>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleUploadImage(item.id)}>
                <FontAwesome name="cloud-upload" size={20} color="#00796B" />
              </TouchableOpacity>
            </View>
            <View style={styles.feeTextContainer}>
              <Text style={styles.feeName}>{item.name}</Text>
              <Text style={styles.feeDescription}>{item.description}</Text>
              <Text style={styles.feeDate}>
                Created: {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <Text style={styles.feeDate}>
                Updated: {new Date(item.updated_at).toLocaleDateString()}
              </Text>
              {item.media.length > 0 && (
                <View style={styles.mediaContainer}>
                  {item.media.map((mediaItem, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        mediaItem.media_type === "image"
                          ? openImageViewer(item.media, index)
                          : openPDF(mediaItem.media_url)
                      }
                    >
                      {mediaItem.media_type === "image" ? (
                        <Image
                          source={{ uri: mediaItem.media_url }}
                          style={styles.mediaImage}
                        />
                      ) : (
                        <View style={styles.pdfThumbnail}>
                          <Icon name="cloud-upload" size={40} color="#FF5252" />
                          <Text style={styles.pdfText}>PDF</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.amountAndEditContainer}>
              <Text style={styles.feeAmount}>${item.fee.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleEditFee(item)}>
                <FontAwesome name="edit" size={20} color="#00796B" />
              </TouchableOpacity>
            </View>
          </View>
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
            value={currentFee?.name || ""} // Use optional chaining and provide a default value
            onChangeText={(text) =>
              setCurrentFee({ ...currentFee, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Fee Amount"
            value={currentFee?.fee?.toString() || ""} // Use optional chaining and provide a default value
            onChangeText={(text) => {
              const feeValue = parseFloat(text);
              setCurrentFee({
                ...currentFee,
                fee: isNaN(feeValue) ? 0 : feeValue,
              });
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={currentFee?.description || ""} // Use optional chaining and provide a default value
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
    backgroundColor: "#f5f5f5", // Light background for contrast
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
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  feeTextContainer: {
    flexDirection: "column",
    flex: 1,
    marginHorizontal: 10,
  },
  amountAndEditContainer: {
    alignItems: "flex-end",
  },
  feeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  feeDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  feeDate: {
    fontSize: 12,
    color: "#888",
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 5,
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
  mediaContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pdfThumbnail: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  pdfText: {
    fontSize: 10,
    color: "#FF5252",
  },
});

export default ManageFeesScreen;
