import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User, Bell, Settings } from "lucide-react-native";

interface OptionItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={styles.iconContainer}>{icon}</View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const ProfileOptions: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <OptionItem
        icon={<User color="#8A2BE2" size={24} />}
        title="Username"
        subtitle="@cooper_bessie"
        onPress={() => navigation.navigate("UsernameSettings")}
      />
      <OptionItem
        icon={<Bell color="#00CED1" size={24} />}
        title="Notifications"
        subtitle="Mute, Push, Email"
        onPress={() => navigation.navigate("Notification")}
      />
      <OptionItem
        icon={<Settings color="#32CD32" size={24} />}
        title="Settings"
        subtitle="Security, Privacy"
        onPress={() => navigation.navigate("ProfileSettings")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProfileOptions;
