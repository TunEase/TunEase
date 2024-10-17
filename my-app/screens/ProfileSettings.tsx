import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileSettingsProps {
  route: any;
  navigation: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  route,
  navigation,
}) => {
  const { userInfo } = route.params;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(userInfo.phone);

  const handleSave = () => {
    // Call API to save updated profile information
    console.log("Updated user info:", { name, email, phone });

    // Navigate back after saving
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  // roleText: {
  //   fontSize: 16,
  //   color: "#555",
  //   marginBottom: 16,
  // },
  saveButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ProfileSettings;
