import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/Form/header";
import { supabase } from "../services/supabaseClient";

interface ServiceSettingProps {
  // serviceId: string | undefined;
}

const ServiceSetting: React.FC<ServiceSettingProps> = ({}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params as { serviceId: string | undefined };
  console.log("Service ID:", serviceId);
  const [isModalVisible, setModalVisible] = useState(false);

  const [settings, setSettings] = useState({
    disable_availability: false,
    disable_service: false,
    accept_cash: false,
    accept_card: false,
    accept_online: false,
    accept_cheque: false,
    accept_notification: false,
    accept_complaint: false,
    accept_review: false,
    processing_time: "",
  });

  useEffect(() => {
    const fetchSettings = async (id: string) => {
      if (!id) {
        console.error("Service ID is undefined");
        return; // Exit if serviceId is invalid
      }

      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings(serviceId!);
  }, [serviceId]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("services")
        .update(settings)
        .eq("id", serviceId);

      if (error) throw error;

      setModalVisible(true);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="Service Settings" onBack={() => navigation.goBack()} />
      <TextInput
        style={styles.input}
        placeholder="Processing Time (min)"
        value={settings.processing_time}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setSettings({ ...settings, processing_time: numericValue });
        }}
        keyboardType="numeric"
      />
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Settings saved successfully!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={styles.modalButtonText}
                onPress={() => navigation.navigate("AddService")}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.settingsContainer}>
        {[
          { label: "Disable Availability", key: "disable_availability" },
          { label: "Disable Service", key: "disable_service" },
          { label: "Accept Cash", key: "accept_cash" },
          { label: "Accept Card", key: "accept_card" },
          { label: "Accept Online", key: "accept_online" },
          { label: "Accept Cheque", key: "accept_cheque" },
          { label: "Accept Notification", key: "accept_notification" },
          { label: "Accept Complaint", key: "accept_complaint" },
          { label: "Accept Review", key: "accept_review" },
        ].map((setting) => {
          const value = settings[setting.key as keyof typeof settings];
          const isActive = typeof value === "boolean" ? value : false;

          return (
            <SettingItem
              key={setting.key}
              label={setting.label}
              isActive={isActive}
              onPress={() =>
                toggleSetting(setting.key as keyof typeof settings)
              }
            />
          );
        })}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} color="#00796B" />
      </View>
    </View>
  );
};

const SettingItem = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.settingItem, isActive && styles.activeSetting]}
  >
    <Text style={[styles.icon, isActive && styles.activeIcon]}>
      {isActive ? "✓" : "✕"}
    </Text>
    <Text style={[styles.settingText, isActive && styles.activeText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 0,
    alignSelf: "center",
    width: "40%",
    top: -15,
    borderRadius: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    width: "50%",
    alignSelf: "center",
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    top: -5,
  },
  settingsContainer: {
    marginBottom: 20,
    top: -10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    backgroundColor: "#e0e0e0",
  },
  activeSetting: {
    borderColor: "#00796B",
    backgroundColor: "#00796B",
  },
  icon: {
    fontSize: 18,
    color: "#666",
    marginRight: 10,
  },
  activeIcon: {
    color: "#fff",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  activeText: {
    color: "#fff",
  },
});

export default ServiceSetting;
