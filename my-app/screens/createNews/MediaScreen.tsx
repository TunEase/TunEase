import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Header from '../../components/Form/header';
import { useSupabaseUpload } from '../../hooks/uploadFile';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MediaTypeOptions } from 'expo-image-picker';

const MediaScreen: React.FC<{ route: any; navigation: any }> = ({ 
  route, 
  navigation 
}) => {
  const { title, content, tags, status, type,businessId } = route.params;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { uploadMultipleFiles, uploading, error } = useSupabaseUpload('application');

  const handleImageUpload = async () => {
    try {
      const result = await uploadMultipleFiles({
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (result?.urls) {
        setSelectedImages(prev => [...prev, ...result.urls.filter(url => url !== undefined) as string[]]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to upload images');
    }
  };

  const handleNext = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Warning', 'Please upload at least one image');
      return;
    }

    navigation.navigate('ValidationScreen', {
      title, 
      content, 
      tags, 
      mediaUrls: selectedImages,
      status,
      type,
      businessId
    });
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Upload Media"
        subtitle="Add Photos & Videos"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.uploadSection}>
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleImageUpload}
            disabled={uploading}
          >
            <Icon name="add-photo-alternate" size={32} color="#004D40" />
            <Text style={styles.uploadText}>Add Photos</Text>
          </TouchableOpacity>

          {uploading && (
            <ActivityIndicator size="large" color="#004D40" />
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.imageGrid}>
          {selectedImages.map((url, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: url }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedImages.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedImages.length === 0 || uploading}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#004D40',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  uploadText: {
    color: '#004D40',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: '#004D40',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
});

export default MediaScreen;