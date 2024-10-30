import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { supabase } from "../services/supabaseClient";
import { FontAwesome } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import { Linking } from "react-native";
import { useSupabaseUpload } from "../hooks/uploadFile";
import { useMedia } from "../hooks/useMedia";

const ManageEligibilityScreen: React.FC<{ route: any }> = ({ route }) => {
  const { insertMediaRecord } = useMedia();
  const { uploadMultipleFiles } = useSupabaseUpload("application");
  const { serviceId } = route.params;

  // Hooks should be declared at the top level
  const [eligibilities, setEligibilities] = useState<
    {
      id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      media: { media_url: string; media_type: string }[];
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEligibility, setCurrentEligibility] = useState<any>(null);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<{ uri: string }[]>([]);

  useEffect(() => {
    fetchEligibilities();
  }, []);

  const fetchEligibilities = async () => {
    const { data, error } = await supabase
      .from("eligibility")
      .select(
        "id, name, description, created_at, updated_at, media (media_url, media_type)"
      )
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

  const handleUploadImage = async (eligibilityId: string) => {
    try {
      console.log("Starting file upload...");
      const { urls, error } = await uploadMultipleFiles({ quality: 0.5 });
      if (error) {
        console.error("Error during file upload:", error);
        return;
      }

      if (urls.length > 0) {
        console.log("File uploaded successfully, inserting media record...");
        const { data, error: insertError } = await insertMediaRecord(
          urls[0],
          "image",
          { eligibility_id: eligibilityId }
        );
        if (insertError) {
          console.error("Error inserting media record:", insertError);
        } else {
          console.log("Media record inserted successfully:", data);
          fetchEligibilities();
        }
      } else {
        console.log("No URLs returned from upload.");
      }
    } catch (err) {
      console.error("Unexpected error during upload:", err);
    }
  };

  const openImageViewer = (
    media: { media_url: string; media_type: string }[],
    index: number
  ) => {
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
                          <FontAwesome
                            name="file-pdf-o"
                            size={40}
                            color="#FF5252"
                          />
                          <Text style={styles.pdfText}>PDF</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
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

      <ImageView
        images={images}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
        backgroundColor="#ffffff"
      />
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
