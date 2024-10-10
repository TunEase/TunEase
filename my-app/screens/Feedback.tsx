import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // Handle feedback submission logic here
    console.log("Feedback submitted:", feedback);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your feedback"
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Feedback;
