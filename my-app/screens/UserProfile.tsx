import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserProfile, updateUserProfile} from '../services/userProfileService';


interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
  password: string;
  avatarUrl?: string;
}

const UserProfile: React.FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>({name: '', email: '', phone: '', role: '', password: '', avatarUrl: ''});
  
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

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  // const handleUpdateProfile = async () => {
  //   if (profile) {
  //     if (!profile.name || !profile.email || !validateEmail(profile.email) || profile.password.length < 6) {
  //       Alert.alert('Validation Error', 'Please ensure all fields are filled correctly.');
  //       return;
  //     }

  //     const updates: UserProfile = { ...profile, phone: profile.phone || '' };

  //     Alert.alert(
  //       'Confirm Update',
  //       'Are you sure you want to update your profile?',
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         { text: 'OK', onPress: async () => {
  //             try {
  //               const success = await updateUserProfile(userId, updates);
  //               Alert.alert(success ? 'Profile updated successfully!' : 'Failed to update profile. Please try again.');
  //             } catch (error: any) {
  //               Alert.alert('Error', 'An error occurred while updating the profile: ' + error.message);
  //             }
  //           }
  //         },
  //       ]
  //     );
  //   } else {
  //     Alert.alert('Error', 'Profile data is missing.');
  //   }
  // };

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
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Name"
        />
        <TextInput 
          style={styles.input}
          value={profile?.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Email"
        />
        <TextInput 
          style={styles.input}
          value={profile?.password || ''}
          onChangeText={(text) => handleInputChange('password', text)}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput 
          style={styles.input}
          value={profile?.role || ''}
          onChangeText={(text) => handleInputChange('role', text)}
          placeholder="Role"
        />
        <TextInput 
          style={styles.input}
          value={profile?.phone || ''}
          onChangeText={(text) => handleInputChange('phone', text)} 
          placeholder="Phone"
        />
        <Text style={styles.email}>{profile?.email || 'No email provided'}</Text>
        <Button title="Update Profile"  />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  profileImage: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    borderRadius: 50, // Half of the width/height to make it circular
    overflow: 'hidden', // Ensures the image is clipped to the border radius
  },
});

export default UserProfile;