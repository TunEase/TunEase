import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { getAllMedia } from '../faker/Helpers/getAllMedia';

interface UploadMediaProps {
  onImageSelect: (uri: string | null) => void;
}

const UploadMedia = ({ onImageSelect }: UploadMediaProps) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [showMediaList, setShowMediaList] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  

  useEffect(() => {
    const fetchMedia = async () => {
      const media = await getAllMedia();
      setMediaList(media.map(item => item.media_url));
    };
    fetchMedia();
  }, []);
  

  const toggleMediaList = () => {
    setShowMediaList(!showMediaList);
  };
  
  const handleAddImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
  
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const newImageUri = result.assets[0].uri;
      if (newImageUri) {
      setMediaList(prevList => [...prevList, newImageUri]);
    }
  };
}

  const renderMediaItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => setMediaUrl(item)}>
      <Image source={{ uri: item }} style={styles.mediaPreview} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
     
        <View style={styles.card}>
          <TouchableOpacity style={styles.uploadBox} onPress={toggleMediaList}>
            {mediaUrl ? (
              <Image source={{ uri: mediaUrl }} style={styles.mediaPreview} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.uploadIcon}>↑</Text>
                <Text style={styles.uploadText}>Upload files or drag and drop</Text>
                <Text style={styles.uploadSubtext}>PNG, JPG, GIF or MP4 up to 10MB each</Text>
                {showMediaList && (
              <>
             <FlatList
              data={mediaList.slice(0, visibleCount)}
              keyExtractor={(item, index) => index.toString()}
               renderItem={renderMediaItem}
               numColumns={2}
              contentContainerStyle={styles.mediaList}
             />
             </>
                )}
              </View>
            )}
                  <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F0F4F8",
  },
  uploadBox: {
    width: 300,
    height: 500,

    borderColor: "#00796B",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    marginBottom: 10,
    elevation: 3,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  uploadIcon: {
    fontSize: 30,
    color: "#00796B",
  },
  uploadText: {
    fontSize: 16,
    color: "#00796B",
    marginTop: 10,
    fontWeight: "bold",
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#004D40",
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  card: {
    width: '90%',
    height: 'auto',
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mediaUrl: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
  mediaList: {
    paddingHorizontal: 25,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  addButton: {
    backgroundColor: "#00796B",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },

});

export default UploadMedia