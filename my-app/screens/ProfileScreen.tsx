import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Header from "../components/UserProfile/Header";
import ProfileInfo from "../components/UserProfile/ProfileInfo";
import StatusSection from "../components/UserProfile/StatusSection";
import ProfileOptions from "../components/UserProfile/ProfileOptions";
import { supabase } from "../services/supabaseClient";

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <Header onLogout={handleLogout} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileInfo
          name="Bessie Cooper"
          email="cooper33@hotmail.com"
          avatarUrl={require("../assets/avat.jpg")}
        />
        <StatusSection onLogout={handleLogout} />
        <ProfileOptions navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

export default ProfileScreen;
