import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { supabase } from "../services/supabaseClient";
import ImageView from "react-native-image-viewing";
import { Linking } from "react-native";
import { useRoute } from '@react-navigation/native';

const MediaGalleryScreen: React.FC = () => {
  const route = useRoute();
  const { type, id } = route.params as { type: "fees" | "services" | "business"; id: string };

  const [images, setImages] = useState<{ uri: string, id: string }[]>([]);
  const [pdfs, setPdfs] = useState<{ uri: string, id: string }[]>([]);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from("media")
      .select("id, media_url, media_type")
      .eq(`${type}_id`, id);

    if (error) {
      console.error("Error fetching media:", error);
    } else {
      const images = data.filter((item) => item.media_type === "image").map((item) => ({ uri: item.media_url, id: item.id }));
      const pdfs = data.filter((item) => item.media_type === "document").map((item) => ({ uri: item.media_url, id: item.id }));
      setImages(images);
      setPdfs(pdfs);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [type, id]);

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewVisible(true);
  };

  const openPDF = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open PDF:", err));
  };

  const deleteMedia = async (mediaId: string) => {
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (error) {
      console.error("Error deleting media:", error);
    } else {
      fetchMedia(); // Refresh media list after deletion
    }
  };

  const confirmDelete = (mediaId: string) => {
    Alert.alert(
      "Delete Media",
      "Are you sure you want to delete this media?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteMedia(mediaId) }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Gallery</Text>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.mediaContainer}>
            <TouchableOpacity onPress={() => openImageViewer(index)}>
              <Image source={{ uri: item.uri }} style={styles.mediaImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        numColumns={2}
      />
      <Text style={styles.title}>PDF Gallery</Text>
      <FlatList
        data={pdfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mediaContainer}>
            <TouchableOpacity onPress={() => openPDF(item.uri)}>
              <View style={styles.pdfThumbnail}>
                <Text style={styles.pdfText}>PDF</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        numColumns={2}
      />
      <ImageView
        images={images.map((item) => ({ uri: item.uri }))}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
        backgroundColor="#ffffff" // White background
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  mediaContainer: {
    margin: 5,
    alignItems: "center",
  },
  mediaImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  pdfThumbnail: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#F0F0F0",
  },
  pdfText: {
    fontSize: 16,
    color: "#FF5252",
  },
  deleteButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: "#FF5252",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default MediaGalleryScreen;