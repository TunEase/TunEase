import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

const ReplyToComplaintScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { complaintId, description, created_at } = route.params;
  const [reply, setReply] = useState("");
  const [animationVisible, setAnimationVisible] = useState(false);

  const handleReplySubmit = async () => {
    if (!reply.trim()) {
      Alert.alert("Error", "Reply cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("complaints")
      .update({
        resolution_note: reply,
        status: "RESOLVED",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", complaintId);

    if (error) {
      Alert.alert("Error", "Failed to submit the reply.");
    } else {
      setAnimationVisible(true);
      setTimeout(() => setAnimationVisible(false), 2000);

      setTimeout(() => navigation.goBack(), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reply to Complaint</Text>
      <View style={styles.complaintDetails}>
        <Text style={styles.complaintText}>Description:</Text>
        <Text style={styles.complaintDescription}>{description}</Text>
        <Text style={styles.complaintDate}>
          Created At: {new Date(created_at).toLocaleString()}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Type your reply here..."
        value={reply}
        onChangeText={setReply}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleReplySubmit}>
        <Text style={styles.buttonText}>Submit Reply</Text>
      </TouchableOpacity>
      {animationVisible && (
        <Animatable.View
          animation="bounceIn"
          duration={1500}
          style={styles.animation}
        >
          <Text style={styles.animationText}>Resolved!</Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  complaintDetails: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderColor: "#C8E6C9",
    borderWidth: 1,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  complaintText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#388E3C",
    marginBottom: 5,
  },
  complaintDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  complaintDate: {
    fontSize: 14,
    color: "#888",
  },
  input: {
    height: 150,
    borderColor: "#C8E6C9",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  animation: {
    position: "absolute",
    top: height / 2 - 50,
    left: width / 2 - 100,
    width: 200,
    height: 100,
    backgroundColor: "rgba(46, 125, 50, 0.9)",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  animationText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ReplyToComplaintScreen;
