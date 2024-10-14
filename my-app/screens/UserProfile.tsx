import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../services/userProfileService";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
}

const UserProfile: React.FC = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID is not available.");
        return;
      }
      try {
        const userProfile = await fetchUserProfile(userId);
        setProfile(userProfile as UserProfile);
        if (userProfile?.avatarUrl) {
          setImage(userProfile.avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      loadProfile();
    }
  }, [userId, loading]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCameraPicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
    setIsModalVisible(false);
  };

  const handleUpdateProfile = async () => {
    if (profile) {
      const updates: UserProfile = { ...profile };
      try {
        const success = await updateUserProfile(userId, updates);
        Alert.alert(
          success
            ? "Profile updated successfully!"
            : "Failed to update profile. Please try again."
        );
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while updating the profile: " + error.message
        );
      }
      if (
        !profile.name ||
        !profile.email ||
        !validateEmail(profile.email) ||
        (profile.phone && profile.phone.length < 8)
      ) {
        Alert.alert(
          "Validation Error",
          "Please ensure all fields are filled correctly."
        );
        return;
      }
    } else {
      Alert.alert("Error", "Profile data is missing.");
    }
  };

  const validateEmail = (email: string) =>
    email.includes("@") && email.includes(".");

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={{
            alignSelf: "center",
            marginBottom: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Image
            source={{ uri: image || "../../assets/camera2.jpg" }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Modal for choosing the image picker options */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleCameraPicker}>
                <Text style={styles.modalOption}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImagePicker}>
                <Text style={styles.modalOption}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={removeImage}>
                <Text style={styles.modalOption}>Remove Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalOption}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TextInput
          style={styles.input}
          value={profile?.name}
          onChangeText={(text) => handleInputChange("name", text)}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={profile?.email}
          onChangeText={(text) => handleInputChange("email", text)}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={profile?.role}
          onChangeText={(text) => handleInputChange("role", text)}
          placeholder="Role"
        />
        <TextInput
          style={styles.input}
          value={profile?.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          placeholder="Phone"
        />
        <Button title="Update Profile" onPress={handleUpdateProfile} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background for better contrast
  },
  modalContent: {
    width: "85%", // Slightly wider for a more spacious look
    backgroundColor: "#ffffff",
    borderRadius: 15, // More rounded corners
    padding: 30, // Increased padding for better spacing
    alignItems: "center",
    shadowColor: "#000", // Added shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  modalOption: {
    padding: 15,
    fontSize: 18,
    color: "#007BFF",
    textAlign: "center", // Centered text for better alignment
    borderBottomWidth: 1, // Added bottom border for separation
    borderBottomColor: "#ccc", // Light border color
    width: "100%", // Full width for better touch targets
  },
});

export default UserProfile;
