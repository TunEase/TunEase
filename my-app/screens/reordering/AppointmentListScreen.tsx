import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { Appointment } from '../../types/Appointment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import Header from '../../components/Form/header';
const AppointmentListScreen = ({navigation}:{navigation:any}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    checkUserRole();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // Fetch the manager's business ID
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data: businessData, error: businessError } = await supabase
        .from('business')
        .select('id')
        .eq('manager_id', userId)
        .single();
      
      if (businessError) {
        Alert.alert('Error fetching business data', businessError.message);
        return;
      }
      
      if (!businessData?.id) {
        console.log('No business found for this manager');
        return;
      }
      
  
      // Fetch appointments for services associated with the business
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          start_time,
          user_profile:client_id (
            name,
            phone
          ),
          service:service_id (
            id,
            name
          )
        `)
        .eq('service.business_id', businessData.id)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });
  
      if (appointmentsError) {
        Alert.alert('Error fetching appointments', appointmentsError.message);
        return;
      }
  
      // Check and transform the data to match the Appointment type if needed
      const transformedData = appointmentsData?.map(apt => ({
        ...apt,
        user_profile: apt.user_profile?.[0] || { name:'Unknown'  , phone: 'N/A' },
        service: apt.service?.[0] || { id: '', name: 'Unknown' }
      })) || [];
  
      setAppointments(transformedData as Appointment[]);
    } catch (error) {
      Alert.alert('Unexpected error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('role')  // Make sure your table has a 'role' column
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
  
      if (error) {
        console.error('Error fetching user role:', error);
        Alert.alert('Error fetching user role', error.message);
      } else {
        setUserRole(data?.role || null);
        console.log('User role:', data?.role); // Add this to debug
      }
    } catch (error) {
      console.error('Unexpected error:', error);
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
      
    >
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentDate}>
          📅 {format(new Date(item.date), 'MMM dd, yyyy')}
        </Text>
        <Text style={styles.appointmentTime}>
          ⏰ {format(new Date(`2000-01-01T${item.start_time}`), 'h:mm a')}
        </Text>
        <View style={styles.clientInfoContainer}>
          <Text style={styles.clientName}>
            👤 {item.user_profile?.name || 'N/A'}
          </Text>
          <Text style={styles.clientPhone}>
            📞 {item.user_profile?.phone || 'N/A'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#00796B" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <Header 
        title="Appointment List"
        subtitle="Manage your schedule"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
   
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#00796B" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#00796B" />
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubText}>Your upcoming appointments will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: userRole === 'BUSINESS_MANAGER' ? 100 : 20 } // Add extra padding when buttons are shown
          ]}
          refreshing={isLoading}
          onRefresh={fetchAppointments}
        />
      )}
  
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
  listContent: {
    paddingHorizontal: 20,
    // paddingBottom: 20,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F2F2F2',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reorderButton: {
    backgroundColor: "#00796B",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reorderButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
    clientInfoContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  clientName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  // serviceName: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginTop: 2,
  // },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
export default AppointmentListScreen;
