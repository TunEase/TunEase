import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Appointment } from '../../types/Appointment';

type ReorderingConfirmationProps = {
  appointments: Appointment[];
  onConfirm: () => void;
  onCancel: () => void;
};

const ReorderingConfirmationScreen: React.FC<ReorderingConfirmationProps> = ({ appointments, onConfirm, onCancel }) => {
  return (
    <View>
      <Text>Confirm Reordering</Text>
      {appointments.map((appointment) => (
        <Text key={appointment.id}>{appointment.date} - {appointment.start_time}</Text>
      ))}
      <Button title="Confirm" onPress={onConfirm} />
      <Button title="Cancel" onPress={onCancel} />
    </View>
  );
};

export default ReorderingConfirmationScreen;
