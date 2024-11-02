import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

type RootStackParamList = {
  UserProfile: undefined;
  Login: undefined;
  MessageScreen: undefined;
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome5 name="home" size={24} color="#004D40" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome5 name="bell" size={24} color="#004D40" />
        <Text style={styles.footerText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("MessageScreen")} // Navigate to Messages
      >
        <FontAwesome5 name="envelope" size={24} color="#004D40" />
        <Text style={styles.footerText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          if (!user) {
            setModalVisible(true); // Show modal if user is not logged in
          } else {
            navigation.navigate("UserProfile");
          }
        }}
      >
        <FontAwesome5 name="user" size={24} color="#004D40" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Login")}
      >
        <FontAwesome5 name="sign-out-alt" size={24} color="#004D40" />
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
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#B0BEC5",
    paddingVertical: 10,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    color: "#004D40",
    marginTop: 3,
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
