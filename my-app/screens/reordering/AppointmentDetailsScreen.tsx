import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Appointment } from '../../types/Appointment';
import { supabase } from '../../services/supabaseClient';

type AppointmentDetailsProps = {
  appointment: Appointment;
};

const AppointmentDetailsScreen: React.FC<AppointmentDetailsProps> = ({ appointment }) => {
  const handleCancelAppointment = async () => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointment.id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Appointment canceled.');
    }
  };

  return (
    <View>
      <Text>Appointment Details</Text>
      <Text>{appointment.date} - {appointment.start_time}</Text>
      <Button title="Cancel Appointment" onPress={handleCancelAppointment} />
    </View>
  );
};

export default AppointmentDetailsScreen;
