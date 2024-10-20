import React, { useEffect, useState } from 'react';
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
  Button,
  TextInput,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserProfile, updateUserProfile, deactivateAccount } from '../services/userProfileService';
import { useAuth } from '../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';

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
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userId = user?.id;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        Alert.alert('Error', 'User ID is not available.');
        return;
      }
      try {
        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
          setProfile(userProfile as UserProfile);
          if (userProfile?.avatarUrl) {
            setImage(userProfile.avatarUrl);
          }
          setName(userProfile.name || '');
          setEmail(userProfile.email || '');
          setPhone(userProfile.phone || null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
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
      const capturedImage = result.assets[0].uri;
      setImage(capturedImage);
    }
  };

  const removeImage = () => {
    setImage(null);
    setIsModalVisible(false);
  };

  const handleProfileUpdate = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is not available.');
      return;
    }

    const updatedProfile = {
      name,
      email,
      phone: phone || undefined,
      avatarUrl: image || undefined,
    };

    try {
      const success = await updateUserProfile(userId, updatedProfile);
      if (success) {
        Alert.alert('Profile updated successfully!');
        setProfile(updatedProfile as UserProfile);
      } else {
        Alert.alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile.');
    }
  };
  const handleNavigateToOnboarding = () => {
    navigation.navigate('OnBoarding1' as never);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setIsChangePasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    }
  };

  const handleDeactivateAccount = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      const success = await deactivateAccount(user.id);
      if (success) {
        Alert.alert('Success', 'Your account has been deactivated.');
        logout();
      } else {
        Alert.alert('Error', 'Failed to deactivate account');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to deactivate account');
    }
  };

  if (isLoading || loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.avatarContainer}>
          <Image source={image ? { uri: image } : require('../assets/avat.jpg')} style={styles.avatar} />
          <View style={styles.editOverlay}>
            <Text style={styles.editText}>Edit</Text>
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={profile?.name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={profile?.email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Phone"
          value={profile?.phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleProfileUpdate}>
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
          <Text style={styles.convertButtonText}>Convert to Business Profile</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
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

      {/* ... existing modals */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F2F2F2",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#00796B",
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00796B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8F5E9",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
    color: "#00796B",
  },
  saveButton: {
    backgroundColor: "#00796B",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 16,
    width: '100%',
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#00796B",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  deactivateButton: {
    backgroundColor: "#FF5252",
  },
  deactivateText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
  },
  settingsText: {
    fontSize: 18,
    color: "#00796B",
    fontWeight: "600",
  },
  convertButton: {
    backgroundColor: "#FFA000", // A warm amber color
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  convertButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginLeft: 8, // Add some space if you decide to include an icon
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  // ... other existing styles
});

export default UserProfile;
