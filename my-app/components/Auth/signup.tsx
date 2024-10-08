import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../../services/supabaseClient";
import * as ImagePicker from "expo-image-picker";

type SignupProps = {
  navigation: NativeStackNavigationProp<any>;
};

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigation.navigate("Login");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Aspect ratio for a square image
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={image ? { uri: image } : require("../../assets/camera2.jpg")}
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Signup</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50, // This makes the image circular
    alignSelf: "center",
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 2,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Signup;
