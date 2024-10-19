import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "../../services/supabaseClient";

type LoginProps = {
  navigation: NativeStackNavigationProp<any>;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      console.log("User logged in:", data.user);
      navigation.navigate("Home");
    }
    if (data.user) {
      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("manager_id", data.user.id)
        .single();
    } else {
      setError("User not found");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your credentials to connect</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or connect with</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Icon
              name="facebook"
              size={40}
              color="#3b5998"
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="google"
              size={40}
              color="#db4437"
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>
            Don't have an account? Register here!
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add overlay effect
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "transparent", // Make input background transparent
    opacity: 0.9,
    color: "#fff",
  },
  forgotPassword: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 20,
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#00796B",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  orText: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialIcon: {
    margin: 10,
  },
  linkText: {
    marginTop: 15,
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Login;
