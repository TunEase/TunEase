import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

type RootStackParamList = {
  UserProfile: undefined;
  BusinessProfileApp: undefined;
  Login: undefined;
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { user, role } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleProfilePress = () => {
    if (!user) {
      setModalVisible(true);
    } else {
      if (role === "user") {
        navigation.navigate("UserProfile");
      } else if (role === "business") {
        navigation.navigate("BusinessProfileApp");
      }
    }
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity>
        <FontAwesome5 name="home" size={24} color="#00796B" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5 name="bell" size={26} color="#00796B" />
        <Text style={styles.footerText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfilePress}>
        <FontAwesome5 name="user" size={24} color="#00796B" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <FontAwesome5 name="sign-out-alt" size={26} color="#00796B" />
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
    paddingVertical: 15,
    elevation: 5,
  },
  footerText: {
    fontSize: 14,
    color: "#004D40",
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
