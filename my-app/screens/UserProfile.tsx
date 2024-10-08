import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateUserProfile } from '../services/userProfileService';

const UserProfile: React.FC = () => {

  const navigation = useNavigation();
  const [profile, setProfile] = useState<{name: string, email: string, phone: string, role: string, password: string, avatarUrl: string} | null>({name:"", email:"", phone:"", role:"", password:"", avatarUrl:""});
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'user_id_here'; // Replace with the actual user ID from authentication

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       const userProfile = await fetchUserProfile(userId);
  //       setProfile(userProfile);
  //     } catch (error) {
  //       console.error('Error fetching profile:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   loadProfile();
  // }, [userId]);

  const handleUpdateProfile = async () => {
    if (profile && profile.name) {
      const updates = { name: profile.name, email: profile.email, phone: profile.phone, role: profile.role, password: profile.password };
      try {
        const success = await updateUserProfile(userId, updates);
        if (success) {
          alert('Profile updated successfully!');
        } else {
          alert('Failed to update profile. Please try again.');
        }
      } catch (error: any) {
        alert('An error occurred while updating the profile: ' + error.message);
      }
    } else {
      alert('Name cannot be empty.');
    }
  };

  // if (isLoading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {profile?.avatarUrl && <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />}
        <TextInput
          style={styles.input}
          value={profile?.name}
          onChangeText={(text) => setProfile(profile ? { ...profile, name: text } : null)}
          placeholder="Name"
        />
        <TextInput 
          style={styles.input}
          value={profile?.email}
          onChangeText={(text) => setProfile(profile ? { ...profile, email: text } : null)}
          placeholder="Email"
        />
        <TextInput 
          style={styles.input}
          value={profile?.password || ''}
          onChangeText={(text) => setProfile(profile ? { ...profile, password: text } : null)}
          placeholder="Password"
        />
        <TextInput 
          style={styles.input}
          value={profile?.role || ''}
          onChangeText={(text) => setProfile(profile ? { ...profile, role: text } : null)}
          placeholder="Role"
        />
             <TextInput 
          style={styles.input}
          value={profile?.phone || ''}
          onChangeText={(text) => setProfile(profile ? { ...profile, phone: text } : null)}
          placeholder="Phone"
        />
        <Text style={styles.email}>{profile?.email || 'No email provided'}</Text>
        <Button title="Update Profile" onPress={handleUpdateProfile} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    color: "#3B82F6",
  },
});

export default UserProfile;