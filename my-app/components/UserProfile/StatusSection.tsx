import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusItemProps {
  count: number;
  label: string;
  isActive?: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ count, label, isActive }) => (
  <View style={[styles.statusItem, isActive && styles.activeStatusItem]}>
    <Text style={[styles.statusCount, isActive && styles.activeStatusText]}>
      {count.toString().padStart(2, "0")}
    </Text>
    <Text style={[styles.statusLabel, isActive && styles.activeStatusText]}>
      {label}
    </Text>
  </View>
);

const StatusSection: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <StatusItem count={14} label="Active" isActive />
      <StatusItem count={6} label="Pending" />
      <StatusItem count={25} label="Complete" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statusItem: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeStatusItem: {
    backgroundColor: "#8A2BE2",
  },
  statusCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
  },
  activeStatusText: {
    color: "#FFF",
  },
  logoutButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#FF4D4D",
    borderRadius: 5,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default StatusSection;
