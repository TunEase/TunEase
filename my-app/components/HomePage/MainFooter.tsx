import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { useAuth } from "../../hooks/useAuth";

type RootStackParamList = {
  UserProfile: undefined; // Existing route
  Login: undefined; // Existing route
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity>
        <FontAwesome5 name="home" size={24} color="#00796B" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="bell" size={24} color="#00796B" />
        <Text style={styles.footerText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (!user) {
            setModalVisible(true); // Show modal if user is not logged in
          } else {
            navigation.navigate("UserProfile");
          }
        }}
      >
        <FontAwesome5 name="user" size={24} color="#00796B" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#00796B" />
        <Text style={styles.footerText}>Logout</Text>
      </TouchableOpacity>

      {/* Custom Styled Modal Alert */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Account Required</Text>
            <Text style={styles.modalMessage}>
              You need to sign in or sign up to access your profile.
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                navigation.navigate("Login");
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F2F2F2",
    borderTopWidth: 1,
    borderTopColor: "#B0BEC5",
    paddingVertical: 12,
    elevation: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#1D242B",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#B0BEC5",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
