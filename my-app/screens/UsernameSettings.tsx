import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const UsernameSettings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateUsername = async () => {
    if (!username) {
      setError("Username cannot be empty");
      return;
    }
    // @ts-ignore
    const userId = supabase.auth.user()?.id;

    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ username })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccessMessage("Username updated successfully!");
      setError(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Username</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
      <TextInput
        placeholder="New Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity onPress={handleUpdateUsername} style={styles.button}>
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

export default UsernameSettings;
