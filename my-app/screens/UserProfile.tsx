import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, Alert, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { deactivateAccount } from '../services/userProfileService';

const UserProfile: React.FC = () => {
  const { user, updatePassword, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleNotifications = () => {
    setNotificationsEnabled((previousState) => !previousState);
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
        logout(); // Log the user out after deactivation
      } else {
        Alert.alert('Error', 'Failed to deactivate account');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to deactivate account');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.title}>Profile Settings</Text>

        {/* Notifications Toggle */}
        <View style={styles.settingsItem}>
          <Text style={styles.settingsText}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsChangePasswordModalVisible(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Deactivate Account */}
        <TouchableOpacity
          style={[styles.button, styles.deactivateButton]}
          onPress={handleDeactivateAccount}
        >
          <Text style={styles.deactivateText}>Deactivate Account</Text>
        </TouchableOpacity>

        {/* Modal for Password Change */}
        <Modal
          visible={isChangePasswordModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <Button title="Save" onPress={handleChangePassword} />
              <Button
                title="Cancel"
                onPress={() => setIsChangePasswordModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingsText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00796B',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  deactivateButton: {
    backgroundColor: '#ff5252',
  },
  deactivateText: {
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default UserProfile;
