import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { Appointment } from '../../types/Appointment';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import Header from '../../components/Form/header';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AppointmentCard = ({ item }: { item: Appointment }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'No time set';
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    try {
      return format(new Date(dateString), 'EEE, MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  return (
    <TouchableOpacity
      style={[styles.appointmentItem, expanded && styles.expandedItem]}
      onPress={toggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentMainInfo}>
          <Text style={styles.appointmentTime}>
            {format(new Date(`2000-01-01T${item.start_time}`), 'h:mm a')}
          </Text>
          <Text style={styles.appointmentDate}>
            {format(new Date(item.date), 'EEE, MMM dd, yyyy')}
          </Text>
        </View>
        <View style={styles.expandIconContainer}>
          <AntDesign 
            name={expanded ? "caretup" : "caretdown"} 
            size={16} 
            color="#00796B" 
          />
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color="#00796B" />
              <Text style={styles.sectionTitle}>Client Information</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailText}>{item.user_profile?.name || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailText}>{item.user_profile?.phone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cut-outline" size={18} color="#00796B" />
              <Text style={styles.sectionTitle}>Service Details</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailText}>{item.service?.name || 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const AppointmentListScreen = ({navigation}:{navigation:any}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    checkUserRole();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data: businessData, error: businessError } = await supabase
        .from('business')
        .select('id')
        .eq('manager_id', userId)
        .single();
      
      if (businessError) throw businessError;
      
      if (!businessData?.id) {
        console.log('No business found for this manager');
        return;
      }
      
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
  
      if (appointmentsError) throw appointmentsError;
  
      const transformedData = appointmentsData?.map(apt => ({
        ...apt,
        user_profile: apt.user_profile || { name: 'Unknown', phone: 'N/A' },
        service: apt.service || { id: '', name: 'Unknown' }
      })) || [];
  
      setAppointments(transformedData as unknown as Appointment[]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
  
      if (error) throw error;
      setUserRole(data?.role || null);
    } catch (error: any) {
      console.error('Error fetching user role:', error);
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <AppointmentCard item={item} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Appointments"
          onBack={() => navigation.goBack()}
          backgroundColor="#00796B"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00796B" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <Header 
        title="Appointments"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
   
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#00796B" />
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubText}>Your upcoming appointments will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
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
            <Ionicons name="flash-outline" size={24} color="#FFFFFF" />
            <Text style={styles.reorderButtonText}>Auto Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reorderButton} 
            onPress={() => navigation.navigate("CustomReorderingScreen")}
          >
            <Ionicons name="list-outline" size={24} color="#FFFFFF" />
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
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  expandedItem: {
    elevation: 4,
    shadowOpacity: 0.15,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  appointmentMainInfo: {
    flex: 1,
  },
  appointmentTime: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00796B',
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
  },
  expandIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  expandedContent: {
    backgroundColor: '#F8F8F8',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  detailSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00796B',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 26,
  },
  detailLabel: {
    width: 60,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 5,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    elevation: 2,
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AppointmentListScreen;