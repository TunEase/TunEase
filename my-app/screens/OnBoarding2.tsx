import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Animated ,TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

const OnBoardingScreen1: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

 
  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 1 of 2</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBar, { width: `${(progress / 2) * 100}%` }]} />
        </View>
      </View>
      
      <Image
        source={{ uri: 'https://example.com/image1.jpg' }} // Replace with a relevant image URL
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Your Business Profile</Text>
      <Text style={styles.description}>
        Let's start converting your profile into a business profile! Follow the steps and unlock premium features for managing your business.
      </Text>
      
      <TouchableOpacity style={styles.nextButton} onPress={() => {
        setProgress(1);
        navigation.navigate('OnBoarding2' as never);
      }}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
const OnBoardingScreen2: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessType, setBusinessType] = useState('');

  const handleNext = () => {
    // TODO: Validate inputs
    setProgress(2);
    navigation.navigate('OnBoardingScreen3' as never
    );
  };

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      {/* ... Progress bar ... */}
      <Text style={styles.title}>Create Your Business</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Address"
        value={businessAddress}
        onChangeText={setBusinessAddress}
      />
      {/* Add a picker for businessType (PUBLIC/PRIVATE) */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const OnBoardingScreen3: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(2);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleNext = () => {
    // TODO: Validate inputs
    setProgress(3);
    navigation.navigate('OnBoardingScreen4' as never);
  };

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      {/* ... Progress bar ... */}
      <Text style={styles.title}>Additional Business Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};


const OnBoardingScreen4: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(1);
  const {user,updateUserRole} = useAuth();
  const handleFinishSetup = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      // Update user role in the database
      const { error } = await supabase
        .from('user_profile')
        .update({ role: 'BUSINESS_MANAGER' })
        .eq('id', user.id);

      if (error) throw error;

      // Update user role in the local state
      await updateUserRole('BUSINESS_MANAGER');

      // Navigate to BusinessProfile
      navigation.navigate('BusinessProfile' as never);
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role. Please try again.');
    }
  };
  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 2 of 2</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBar, { width: `${(progress / 2) * 100}%` }]} />
        </View>
      </View>

      <Image
        source={{ uri: 'https://i.pinimg.com/736x/1a/68/d5/1a68d54bbf496b77654940176834dd24.jpg' }} // Replace with a relevant image URL
        style={styles.image}
      />
      <Text style={styles.title}>How to Add Your Business</Text>
      <Text style={styles.description}>
        Here’s an example of adding a business. Fill in your business details to continue.
      </Text>

      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>Example Business</Text>
        <Text style={styles.exampleText}>Name: Jane's Bakery</Text>
        <Text style={styles.exampleText}>Address: 123 Main Street, Cityville</Text>
        <Text style={styles.exampleText}>Contact: (555) 123-4567</Text>
        <Text style={styles.exampleText} >...</Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleFinishSetup}>
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#E0E0E0',
  },
  progressContainer: {
    width: '80%',
    marginBottom: 20,
  },
  progressBarBackground: {
    backgroundColor: '#004D40',
    borderRadius: 10,
    height: 10,
  },
  progressBar: {
    backgroundColor: '#80CBC4',
    height: 10,
    borderRadius: 10,
  },
  progressText: {
    color: '#B2DFDB',
    marginBottom: 5,
    textAlign: 'center',
  },
  exampleContainer: {
    backgroundColor: '#003D33',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#80CBC4',
    marginBottom: 10,
    textAlign: 'center',
  },
  exampleText: {
    fontSize: 18,
    color: '#B2DFDB',
    marginBottom: 8,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#80CBC4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#004D40',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export { OnBoardingScreen1,OnBoardingScreen2, OnBoardingScreen3, OnBoardingScreen4 };