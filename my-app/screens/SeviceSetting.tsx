import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Header from "../components/Form/header";

interface ServiceSettingProps {
  serviceId: string;
}

const ServiceSetting: React.FC<ServiceSettingProps> = ({ serviceId }) => {
  const [settings, setSettings] = useState({
    disableAvailability: false,
    disableService: false,
    acceptCash: false,
    acceptCard: false,
    acceptOnline: false,
    acceptCheque: false,
    acceptNotification: false,
    acceptComplaint: false,
    acceptReview: false,
    processingTime: "",
  });

  useEffect(() => {
    // Fetch current settings from the server using serviceId
    // Example: fetchSettings(serviceId).then(data => setSettings(data));
  }, [serviceId]);

  const handleSave = () => {
    // Save the updated settings to the server
    // Example: saveSettings(serviceId, settings);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Service Settings</Text> */}
      <Header title="Service Settings" />
      <TextInput
        style={styles.input}
        placeholder="Processing Time"
        value={settings.processingTime}
        onChangeText={(text) =>
          setSettings({ ...settings, processingTime: text })
        }
      />
      <View style={styles.switchContainer}>
        <Switch
          value={settings.disableAvailability}
          onValueChange={(value) =>
            setSettings({ ...settings, disableAvailability: value })
          }
        />
        <Text style={styles.text}>Disable Availability</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.disableService}
          onValueChange={(value) =>
            setSettings({ ...settings, disableService: value })
          }
        />
        <Text style={styles.text}>Disable Service</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptCash}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptCash: value })
          }
        />
        <Text style={styles.text}>Accept Cash</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptCard}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptCard: value })
          }
        />
        <Text style={styles.text}>Accept Card</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptOnline}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptOnline: value })
          }
        />
        <Text style={styles.text}>Accept Online</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptCheque}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptCheque: value })
          }
        />
        <Text style={styles.text}>Accept Cheque</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptNotification}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptNotification: value })
          }
        />
        <Text style={styles.text}>Accept Notification</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptComplaint}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptComplaint: value })
          }
        />
        <Text style={styles.text}>Accept Complaint</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings.acceptReview}
          onValueChange={(value) =>
            setSettings({ ...settings, acceptReview: value })
          }
        />
        <Text style={styles.text}>Accept Review</Text>
      </View>
      <View>
        {/* <Icon name="save" size={30} color="#00796B" /> */}
        <Text style={styles.buttonText}>Save</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
    color: "#00796B",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ServiceSetting;
