# TunEase
its a local service provider mobile app
Benefits of this approach:
1. Consistent header styling across screens
Easy to maintain and update
Customizable through props
TypeScript support for better development experience
Reusable across the entire app
Includes StatusBar handling
Easy to extend with additional features
Remember to adjust the padding and heights based on your specific needs and different device requirements (especially for iOS notch handling if needed).
<!-- import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../components/common/Header';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        subtitle="Personal Information"
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john@example.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen; -->