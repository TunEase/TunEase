import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper'; // Assuming you're using react-native-paper
import { Appointment } from '../../types/Appointment';
import { supabase } from '../../services/supabaseClient';

type AppointmentDetailsProps = {
  route: {
    params: {
      appointment: Appointment;
    };
  };
  navigation: any;
};

const AppointmentDetailsScreen: React.FC<AppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointment } = route.params;
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const fetchClientDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', appointment.client_id)
        .single();

      if (error) throw error;
      setClientDetails(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointment.id);

      if (error) throw error;
      Alert.alert('Success', 'Appointment canceled successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Appointment Details</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Text style={styles.text}>📅 {new Date(appointment.date).toLocaleDateString()}</Text>
          <Text style={styles.text}>🕒 {appointment.start_time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <Text style={styles.text}>👤 {clientDetails?.full_name}</Text>
          <Text style={styles.text}>📧 {clientDetails?.email}</Text>
          <Text style={styles.text}>📱 {clientDetails?.phone || 'No phone provided'}</Text>
        </View>

        {appointment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{appointment.notes}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleCancelAppointment}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
          >
            Cancel Appointment
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#6B7280', // Modern gray color
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentDetailsScreen;