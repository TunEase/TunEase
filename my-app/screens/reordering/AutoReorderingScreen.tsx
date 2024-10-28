import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

const AutoReorderingScreen = () => {
  const [isReordered, setIsReordered] = useState(false);

  const handleAutomaticReorder = async () => {
    // ... existing logic ...

    setIsReordered(true);

    // ... existing notification logic ...
  };

  const notifyUser = async (userId: string, message: string) => {
    // ... existing notification logic ...
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Automatic Reordering</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          This feature will automatically reorder appointments based on availability and priority.
        </Text>
        <TouchableOpacity 
          style={styles.reorderButton} 
          onPress={handleAutomaticReorder}
          disabled={isReordered}
        >
          <Ionicons name="refresh-circle-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {isReordered ? 'Appointments Reordered' : 'Reorder Appointments'}
          </Text>
        </TouchableOpacity>
        {isReordered && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.successIcon} />
            <Text style={styles.successText}>Appointments have been successfully reordered.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor: '#00796B',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  reorderButton: {
    backgroundColor: '#00796B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
  },
  successIcon: {
    marginRight: 10,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default AutoReorderingScreen;