import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserProfile, updateUserProfile } from '../services/userProfileService';

interface UserProfile {
  name: string;
  email: string;
  phone?: string; // Make phone optional
  role: string;
  password: string;
  avatarUrl?: string; // Make avatarUrl optional
}

const UserProfile: React.FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>({
    name: "",
    email: "",
    phone: "", // Initialize phone as an empty string
    role: "",
    password: "",
    avatarUrl: "", // Initialize avatarUrl as an empty string
  });
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'user_id_here'; // Replace with the actual user ID from authentication

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await fetchUserProfile(userId);
        setProfile(userProfile as UserProfile);  
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const validateEmail = (email: string) => email.includes('@') && email.includes('.');

  const handleUpdateProfile = async () => {
    if (profile) {
      if (!profile.name) {
        alert('Name cannot be empty.');
        return;
      }
      if (!profile.email) {
        alert('Email cannot be empty.');
        return;
      }
      // Validate email
      if (!validateEmail(profile.email)) {
        alert('Please enter a valid email address.');
        return;
      }
      // Validate password length
      if (profile.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      const updates: UserProfile = { 
        name: profile.name, 
        email: profile.email, 
        phone: profile.phone || '', // Ensure phone is a string
        role: profile.role, 
        password: profile.password 
      };

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
      alert('Profile data is missing.');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
  infoContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 18,
    color: 'gray',
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
  bio: {
    fontSize: 14,
    color: 'darkgray',
  },
  profilePicture: {
    width: 100, // Width of the image
    height: 100, // Height of the image
    borderRadius: 50, // Makes the image circular
    marginBottom: 20, // Space below the image
  },
});

export default UserProfile;