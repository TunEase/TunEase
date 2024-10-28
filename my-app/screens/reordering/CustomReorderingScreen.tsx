import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { supabase } from '../../services/supabaseClient';
import { Appointment } from '../../types/Appointment';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const CustomReorderingScreen = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) {
      Alert.alert('Error fetching appointments', error.message);
    } else {
      setAppointments(data);
    }
  };

  const handleReorder = async (data: Appointment[]) => {
    // Update appointments based on new order
    data.forEach(async (appointment, index) => {
      await supabase
        .from('appointments')
        .update({ start_time: calculateNewStartTime(index) })
        .eq('id', appointment.id);
    });

    Alert.alert('Reorder Successful', 'Appointments have been reordered');
    setAppointments(data);
  };

  const calculateNewStartTime = (index: number) => {
    // Logic to calculate new start times based on index
    const baseTime = new Date(2000, 0, 1, 8, 0, 0); // Start at 8:00 AM
    baseTime.setMinutes(baseTime.getMinutes() + index * 30); // 30-minute intervals
    return format(baseTime, 'HH:mm:ss');
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Appointment>) => {
    return (
      <TouchableOpacity
        style={[styles.appointmentItem, isActive && styles.activeItem]}
        onLongPress={drag}
      >
        <Ionicons name="reorder-three" size={24} color="#00796B" style={styles.dragIcon} />
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
          <Text style={styles.appointmentTime}>{format(new Date(`2000-01-01T${item.start_time}`), 'h:mm a')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Reordering</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instructions}>Long press and drag to reorder appointments</Text>
        <DraggableFlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => handleReorder(data)}
          contentContainerStyle={styles.listContent}
        />
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
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  activeItem: {
    backgroundColor: '#E0F2F1',
    elevation: 5,
  },
  dragIcon: {
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default CustomReorderingScreen;