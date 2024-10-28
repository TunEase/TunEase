import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { Appointment } from '../../types/Appointment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
const AppointmentListScreen = ({navigation}:{navigation:any}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    checkUserRole();
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

  const checkUserRole = async () => {
    const { data, error } = await supabase
      .from('user_profile')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id);
    if (error) {
      Alert.alert('Error fetching user role', error.message);
    } else {
      setUserRole(data[0].role);
    }
  };

  const handleReorder = () => {
    if (userRole !== 'BUSINESS_MANAGER') {
      Alert.alert('Access Denied', 'Only business managers can reorder appointments');
      return;
    }
    // Navigate to Reordering Screen
    // navigate('ReorderingScreen');
  };
  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={styles.appointmentItem}
      onPress={() => navigation.navigate('AppointmentDetailsScreen', { appointment: item })}
    >
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentDate}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
        <Text style={styles.appointmentTime}>{format(new Date(`2000-01-01T${item.start_time}`), 'h:mm a')}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#00796B" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointment List</Text>
      </View>
      
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      {userRole === 'BUSINESS_MANAGER' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.reorderButton} 
            onPress={() => navigation.navigate("AutoReorderingScreen")}
          >
            <Ionicons name="flash-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.reorderButtonText}>Auto Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reorderButton} 
            onPress={() => navigation.navigate("CustomReorderingScreen")}
          >
            <Ionicons name="list-outline" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.reorderButtonText}>Custom Reorder</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    backgroundColor: "#00796B",
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reorderButton: {
    backgroundColor: "#00796B",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 5,
  },
  reorderButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
});
export default AppointmentListScreen;
