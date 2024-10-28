import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { supabase } from "../../services/supabaseClient";
import * as ImagePicker from "expo-image-picker";
import { useSupabaseUpload } from "../../hooks/uploadFile";

type SignupProps = {
  navigation: NativeStackNavigationProp<any>;
};

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { uploading, error: uploadError, pickFile, uploadFile } = useSupabaseUpload("avatars");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!image) {
      setError("Please select a profile image");
      return;
    }

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({ email, password });

      if (signupError) throw signupError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User ID not found after signup");

      const { path: avatarPath, error: imageError } = await uploadFile(image, "image/jpeg", `profile/${userId}`);
      if (imageError) throw new Error(imageError);

      const { error: profileError } = await supabase
        .from("user_profile")
        .insert({
          id: userId,
          name,
          email,
          phone,
          avatar_url: avatarPath,
        });

      if (profileError) throw profileError;

      console.log("User signed up successfully");
      navigation.navigate("Login");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImagePick = async () => {
    const result = await pickFile({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      folder: "profile",
      width: 1,
      height: 1,
    });

    if (result?.path) {
      setFileUrl(result.path);
      setImage(result.path);
    }
  };

  return (
    <ImageBackground source={require("../../assets/background.jpg")} style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={image ? { uri: image } : require("../../assets/camera2.jpg")}
            style={uploading ? [styles.image, styles.imageLoading] : styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Signup</Text>
        <Text style={styles.subtitle}>Please create your account to continue with us.</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput placeholder="Username" style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#888" />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#888" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} placeholderTextColor="#888" />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholderTextColor="#888" />

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  header: { position: "absolute", top: 40, left: 20, zIndex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#fff" },
  subtitle: { fontSize: 16, textAlign: "center", color: "#fff", marginBottom: 20 },
  image: { width: 120, height: 120, borderRadius: 60, alignSelf: "center", marginBottom: 20, borderColor: "#00796B", borderWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  input: { marginBottom: 12, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "transparent", opacity: 0.9, color: "#fff" },
  button: { marginTop: 12, paddingVertical: 10, backgroundColor: "#00796B", borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  linkText: { marginTop: 15, color: "#fff", textAlign: "center" },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
  imageLoading: { opacity: 0.7 },
});

export default Signup;
