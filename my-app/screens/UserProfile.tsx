import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchUserProfile,
  updateUserProfile,
  deactivateAccount,
} from "../services/userProfileService";
import { useAuth } from "../hooks/useAuth";
import * as ImagePicker from "expo-image-picker";

import starBookmark from "../assets/FAV.png";

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
  const { user, loading, updatePassword, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = user?.id;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID is not available.");
        return;
      }
      try {
        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
          setProfile(userProfile as UserProfile);
          setImage(userProfile.avatarUrl || null);
          setName(userProfile.name || "");
          setEmail(userProfile.email || "");
          setPhone(userProfile.phone || null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Failed to load user profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && userId) {
      loadProfile();
    }
  }, [userId, loading]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      handleProfileUpdate(selectedImage);
    }
    setIsModalVisible(false);
  };

  const handleCameraPicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const capturedImage = result.assets[0].uri;
      setImage(capturedImage);
      handleProfileUpdate(capturedImage);
    }
    setIsModalVisible(false);
  };

  const removeImage = () => {
    setImage(null);
    handleProfileUpdate(null);
    setIsModalVisible(false);
  };

  const handleProfileUpdate = async (newImage?: string | null) => {
    if (!userId) {
      Alert.alert("Error", "User ID is not available.");
      return;
    }

    const updatedProfile = {
      name,
      email,
      phone: phone || undefined,
      avatarUrl: newImage !== undefined ? newImage : image,
    };

    try {
      const success = await updateUserProfile(
        userId,
        updatedProfile as Partial<UserProfile>
      );
      if (success) {
        Alert.alert("Profile updated successfully!");
        setProfile(
          (prevProfile) =>
            ({ ...prevProfile, ...updatedProfile }) as UserProfile
        );
      } else {
        Alert.alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error updating profile.");
    }
  };

  const handleNavigateToOnboarding = () => {
    navigation.navigate("OnBoarding1" as never);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      setIsChangePasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to change password");
    }
  };

  const handleDeactivateAccount = async () => {
    if (!user) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    try {
      const success = await deactivateAccount(user.id);
      if (success) {
        Alert.alert("Success", "Your account has been deactivated.");
        logout();
      } else {
        Alert.alert("Error", "Failed to deactivate account");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to deactivate account");
    }
  };

  if (isLoading || loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        {/* Add the image in the top right */}
        <TouchableOpacity
          onPress={() => navigation.navigate("FavoritesScreen" as never)}
          style={styles.bookmarkIcon}
        >
          <Image source={starBookmark} style={styles.bookmarkIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.avatarContainer}
        >
          <Image
            source={image ? { uri: image } : require("../assets/avat.jpg")}
            style={styles.avatar}
          />
          <View style={styles.editOverlay}>
            <Text style={styles.editText}>Edit</Text>
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Phone"
          value={phone || ""}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleProfileUpdate()}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.settingsItem}>
          <Text style={styles.settingsText}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsChangePasswordModalVisible(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deactivateButton]}
          onPress={handleDeactivateAccount}
        >
          <Text style={styles.deactivateText}>Deactivate Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.convertButton}
          onPress={handleNavigateToOnboarding}
        >
          <Text style={styles.convertButtonText}>
            Convert to Business Profile
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isChangePasswordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsChangePasswordModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleImagePicker}
            >
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCameraPicker}
            >
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={removeImage}>
              <Text style={styles.modalButtonText}>Remove Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F8F8",
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginVertical: 20,
    padding: 4,
    borderRadius: 75,
    backgroundColor: "#fff",
    shadowColor: "#00796B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 7,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#E8F5E9",
  },
  editOverlay: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#00796B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#2E4F4F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#00796B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 16,
    width: "100%",
    shadowColor: "#00796B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
    backgroundColor: "#FFFFFF",
  },
  settingsText: {
    fontSize: 16,
    color: "#2E4F4F",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#00796B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#00796B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  deactivateButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FF5252",
  },
  deactivateText: {
    color: "#FF5252",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  convertButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 16,
    width: "100%",
    borderWidth: 2,
    borderColor: "#00796B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  convertButtonText: {
    color: "#00796B",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 15,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#00796B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: "100%",
  },
  modalButtonText: {
    color: "#00796B",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 0,
  },
  bookmarkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 60,
    height: 60,
  },
});

export default UserProfile;
