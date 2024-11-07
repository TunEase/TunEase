import { FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabaseClient";

type RootStackParamList = {
  UserProfile: undefined;
  Login: undefined;
  MessageScreen: undefined;
  Home: undefined; // Add Home to the navigation stack
};

interface FooterProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { user,logout  } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("messages")
          .select("is_read")
          .eq("is_read", false)
          .eq("sender_id", user.id);

        if (error) {
          console.error("Error fetching unread messages count:", error);
        } else {
          setUnreadCount(data.length);
        }
      }
    };

    fetchUnreadMessagesCount();
  }, [user]);
  const handleLogout = async () => {
    if (!user) {
      navigation.navigate("Login");
      return;
    }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await logout();
              if (success) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                "Error",
                "Failed to logout. Please try again."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Home")} // Navigate to Home
      >
        <FontAwesome5 name="home" size={24} color="#004D40" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome5 name="bell" size={24} color="#004D40" />
        <Text style={styles.footerText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("MessageScreen")}
      >
        <FontAwesome5 name="envelope" size={24} color="#004D40" />
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
        )}
        <Text style={styles.footerText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          if (!user) {
            setModalVisible(true);
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
        onPress={handleLogout}
      >
        <FontAwesome5 
          name={user ? "sign-out-alt" : "sign-in-alt"} 
          size={24} 
          color="#004D40" 
        />
        <Text style={styles.footerText}>
          {user ? "Logout" : "Login"}
        </Text>
      </TouchableOpacity>

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
    position: "relative",
  },
  footerText: {
    fontSize: 12,
    color: "#004D40",
    marginTop: 3,
  },
  unreadBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadCount: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
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
