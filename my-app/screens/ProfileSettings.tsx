import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const ProfileSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateProfile = async () => {
    if (!email && !password) {
      setError("Please provide at least one field to update.");
      return;
    }

    const updates: any = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    // @ts-ignore

    const userId = supabase.auth.user()?.id;

    const { error: updateError } = await supabase
      .from("user_profile")
      .update(updates)
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccessMessage("Profile updated successfully!");
      setError(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
      <TextInput
        placeholder="New Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
  successText: {
    color: "green",
  },
  linkText: {
    marginTop: 10,
    color: "#007bff",
  },
});

export default ProfileSettings;
