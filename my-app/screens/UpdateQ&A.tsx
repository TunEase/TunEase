import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabaseClient";

interface UpdateQAProps {
  businessId: number;
}

const UpdateQA: React.FC<UpdateQAProps> = ({ businessId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("qa")
      .insert({ business_id: businessId, question, answer });

    if (error) {
      console.error("Error adding Q&A:", error);
    } else {
      console.log("Q&A added successfully", data);
      // Add navigation back logic or reset the form here if necessary
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Update Q&A</Text>

      {/* Question Input */}
      <Text style={styles.sectionHeader}>Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
      />

      {/* Answer Input */}
      <Text style={styles.sectionHeader}>Answer</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the answer"
        value={answer}
        onChangeText={setAnswer}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UpdateQA;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
