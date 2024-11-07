import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '../../components/Form/header';

interface LoadingScreenProps {
  title: string;
  onBack: () => void;
}

const LoadingScreen = ({ title, onBack }: LoadingScreenProps) => {
  return (
    <View style={styles.container}>
      <Header 
        title={title}
        onBack={onBack}
        backgroundColor="#00796B"
      />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingScreen;