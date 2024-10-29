import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

interface Service {
  id: string;
  name: string;
  description: string;
  // Add other fields as necessary
}

interface ServiceSettingProps {
  serviceId: string;
}

const ServiceSetting: React.FC<ServiceSettingProps> = ({ serviceId }) => {
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error('Error fetching service settings:', error);
        Alert.alert('Error', 'Failed to fetch service settings');
      }
    };

    fetchService();
  }, [serviceId]);

  const handleUpdate = async () => {
    if (!service) return;

    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: service.name,
          description: service.description,
          // Add other fields as necessary
        })
        .eq('id', serviceId);

      if (error) throw error;
      Alert.alert('Success', 'Service settings updated successfully');
    } catch (error) {
      console.error('Error updating service settings:', error);
      Alert.alert('Error', 'Failed to update service settings');
    }
  };

  if (!service) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Settings</Text>
      <TextInput
        style={styles.input}
        value={service.name}
        onChangeText={(text) => setService({ ...service, name: text })}
        placeholder="Service Name"
      />
      <TextInput
        style={styles.input}
        value={service.description}
        onChangeText={(text) => setService({ ...service, description: text })}
        placeholder="Service Description"
        multiline
      />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ServiceSetting;