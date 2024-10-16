import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const OnBoardingScreen1: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/image1.jpg' }} // Replace with a relevant image URL
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Your Business Profile</Text>
      <Text style={styles.description}>
        This is the first step to converting your profile to a business profile.
      </Text>
      <Button title="Next" onPress={() => navigation.navigate('OnBoarding2' as never)} color="#c2bebe" />
    </LinearGradient>
  );
};

const OnBoardingScreen2: React.FC = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/image2.jpg' }} // Replace with a relevant image URL
        style={styles.image}
      />
      <Text style={styles.title}>How to Add Your Business</Text>
      <Text style={styles.description}>
        Here's an example of adding a business:
      </Text>
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>Example Business</Text>
        <Text style={styles.exampleText}>Name: Jane's Bakery</Text>
        <Text style={styles.exampleText}>Address: 123 Main Street, Cityville</Text>
        <Text style={styles.exampleText}>Contact: (555) 123-4567</Text>
        <Text style={styles.exampleText}>
          Next, you can fill in details like your business name, address, and contact information.
        </Text>
      </View>
      <Button title="Next" onPress={() => navigation.navigate('BusinessProfile' as never)} color="#c2bebe" />
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
});

export { OnBoardingScreen1, OnBoardingScreen2 };
