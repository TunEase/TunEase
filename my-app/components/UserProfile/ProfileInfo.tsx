import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface ProfileInfoProps {
  name: string;
  email: string;
  avatarUrl: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name,
  email,
  avatarUrl,
}) => {
  return (
    <View style={styles.container}>
      <Image source={avatarUrl} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#00796B",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileInfo;
