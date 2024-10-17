import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Button, ActivityIndicator, Alert } from "react-native";
import ProfileInfo from "../components/UserProfile/ProfileInfo";
import StatusSection from "../components/UserProfile/StatusSection";
import ProfileOptions from "../components/UserProfile/ProfileOptions";
import { supabase } from "../services/supabaseClient";
import { fetchUserProfile, updateUserProfile } from "../services/userProfileService";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../hooks/useAuth";

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  const userId = user?.id;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID is not available.");
        return;
      }
      try {
        const userProfile = await fetchUserProfile(userId);
        setProfile(userProfile);
        if (userProfile?.avatarUrl) {
          setImage(userProfile.avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      loadProfile();
    }
  }, [userId, loading]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleUpdateProfile = async () => {
    if (profile) {
      try {
        const success = await updateUserProfile(userId, profile);
        Alert.alert(success ? "Profile updated successfully!" : "Failed to update profile.");
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert("Error", "An error occurred while updating your profile.");
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileInfo
          name={profile?.name || "Anonymous"}
          email={profile?.email || "No email"}
          avatarUrl={image || require("../assets/avat.jpg")}
          onImageChange={handleImagePicker}
        />
        <StatusSection onLogout={handleLogout} />
        <ProfileOptions navigation={navigation} userInfo={profile}  />
        <Button title="Convert to Business Profile" onPress={() => navigation.navigate('OnBoarding1')} />
        {/* <Button title="Update Profile" onPress={handleUpdateProfile} /> */}
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
