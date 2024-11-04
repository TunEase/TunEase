import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, StatusBar,Animated } from 'react-native';
import { supabase } from '../../services/supabaseClient';
// import { NotificationService } from '../../services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../types/Appointment';
import Header from '../../components/Form/header';

const AutoReorderingScreen = ({ navigation }: { navigation: any }) => {
  const [isReordering, setIsReordering] = useState(false);
  const [isReordered, setIsReordered] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const animatedValues = React.useRef(
    appointments.map(() => new Animated.Value(0))
  ).current;
  const handleAutomaticReorder = async () => {
    try {
      setIsReordering(true);
  
      // Fetch all pending appointments
      const { data: fetchedAppointments, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(*)
        `)
        .eq('status', 'CANCELLED')
        .order('created_at', { ascending: true });
  
      if (fetchError) throw fetchError;
      if (!fetchedAppointments || fetchedAppointments.length === 0) {
        Alert.alert('No Appointments', 'There are no cancelled appointments to reorder.');
        return;
      }
  
      // Set initial appointments
      setAppointments(fetchedAppointments);
  
      // Get business hours and reorder logic
      const firstService = fetchedAppointments[0]?.service;
      const startHour = firstService ? parseInt(firstService.start_time.split(':')[0]) : 9;
      const endHour = firstService ? parseInt(firstService.end_time.split(':')[0]) : 17;
      
      const today = new Date();
      today.setHours(startHour, 0, 0, 0);
  
  
      // Reorder appointments
      const reorderedAppointments = appointments.map((appointment: Appointment, index: number) => {
        const serviceDuration = appointment.service?.duration || 60; // Get duration from service
        const appointmentDate = new Date(today);
        const totalMinutes = index * serviceDuration;
        const hoursToAdd = Math.floor(totalMinutes / 60);
        const minutesToAdd = totalMinutes % 60;
  
        appointmentDate.setHours(startHour + hoursToAdd, minutesToAdd);
  
        // If appointment falls outside business hours, move to next day
        if (appointmentDate.getHours() >= endHour) {
          appointmentDate.setDate(appointmentDate.getDate() + 1);
          appointmentDate.setHours(startHour, 0, 0, 0);
        }
  
        // Calculate end time
        const endTime = new Date(appointmentDate);
        endTime.setMinutes(endTime.getMinutes() + serviceDuration);
  
        return {
          ...appointment,
          id: appointment.id,
          date: appointmentDate.toISOString().split('T')[0],
          start_time: formatTime(appointmentDate),
          end_time: formatTime(endTime),
          status: 'PENDING_CONFIRMATION' as const,
          updated_at: new Date().toISOString()
        };
      });
   
  
     // Animate the reordering
    Animated.sequence([
      Animated.stagger(200, 
        animatedValues.map(animation =>
          Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          })
        )
      ),
      Animated.delay(500),
    ]).start(async () => {
          // Update appointments and send notifications
    for (const appointment of reorderedAppointments) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          date: appointment.date,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          status: appointment.status,
          updated_at: appointment.updated_at
        })
        .eq('id', appointment.id);

      if (updateError) throw updateError;

      // Send notification to client about rescheduling
      // await NotificationService.sendReschedulingNotification(
      //   appointment,
      //   appointment.date,
      //   appointment.start_time
      // );
    }

      // Update UI with reordered appointments
      setAppointments(reorderedAppointments);
      setIsReordered(true);
      Alert.alert(
        'Success',
        `Successfully reordered ${reorderedAppointments.length} appointments.`
      );
    });

  } catch (error) {
    console.error('Reordering error:', error);
    Alert.alert('Error', 'Failed to reorder appointments. Please try again.');
  } finally {
    setIsReordering(false);
  }
};

  const notifyUser = async (appointmentId: string, message: string) => {
    try {
      // Get the client_id from the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('id', appointmentId)
        .single();
  
      if (appointmentError) {
        console.error('Appointment fetch error:', appointmentError);
        throw appointmentError;
      }
  
      // Create notification record matching your schema
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: appointment.client_id,
          message: message,
          is_read: false,
          created_at: new Date().toISOString()
        });
  
      if (notificationError) {
        console.error('Notification creation error:', notificationError);
        throw notificationError;
      }
  
    } catch (error) {
      console.error('Notification error:', error);
    }
  };
  const createNotificationMessage = (date: string, time: string): string => {
    return `Your appointment has been rescheduled to ${formatDate(date)} at ${formatTime12Hour(time)}. Please check your appointments for details.`;
  };
  
// Helper functions for date and time formatting
const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0];
};

const formatTime12Hour = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
  // Add this new component
  const AppointmentCard = ({ appointment, index, animation }: { 
    appointment: Appointment; 
    index: number;
    animation: Animated.Value;
  }) => (
    <Animated.View
      style={[
        styles.appointmentCard,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (index * 80)], // 80 is the card height + margin
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.appointmentTime}>
        {appointment.start_time} - {appointment.end_time}
      </Text>
      <Text style={styles.appointmentDate}>{appointment.date}</Text>
    </Animated.View>
  );

 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      <Header 
        title="Automatic Reordering"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
   
      <View style={styles.content}>
        <Text style={styles.description}>
          This feature will automatically reorder appointments based on availability and priority.
        </Text>
        
        <View style={styles.appointmentsContainer}>
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              index={index}
              animation={animatedValues[index] || new Animated.Value(0)}
            />
          ))}
        </View>
  
        <TouchableOpacity 
          style={[
            styles.reorderButton,
            (isReordering || isReordered) && styles.disabledButton
          ]} 
          onPress={handleAutomaticReorder}
          disabled={isReordering || isReordered}
        >
          <Ionicons 
            name={isReordering ? "hourglass-outline" : "refresh-circle-outline"} 
            size={24} 
            color="#FFFFFF" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>
            {isReordering ? 'Reordering...' : 
             isReordered ? 'Appointments Reordered' : 
             'Reorder Appointments'}
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
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  appointmentsContainer: {
    width: '100%',
    padding: 10,
    marginVertical: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default AutoReorderingScreen;