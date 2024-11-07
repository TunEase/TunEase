import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Header from '../../components/Form/header';
import AppointmentFilters from '../../components/Appointment/AppointmentFilters';
import AppointmentContent from '../../components/Appointment/AppointmentContent';
import LoadingScreen from '../../components/Appointment/LoadingScreen';
import { useAppointments } from '../../hooks/useAppointments';
import { useBusinessAccess } from '../../hooks/useBusinessAccess';
import { format,addMinutes,isBefore } from 'date-fns';
import HeaderEditButton from '../../components/Appointment/HeaderEditButton';
import ConfirmationModal from '../../components/StatusComponents/ConfirmationModal';
import { Appointment } from '../../types/Appointment';
import {supabase} from '../../services/supabaseClient';
const AppointmentListScreen = ({ navigation }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedService, setSelectedService] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { userRole, checkAccess } = useBusinessAccess(navigation);
  const { appointments, services, isLoading, fetchAppointments ,cancelAppointment} = useAppointments(selectedDate, selectedService);

  
  useEffect(() => {
    
    checkAccess();
  }, []);

// Check if appointment can be cancelled (60 minutes before)
const canCancelAppointment = (appointmentDate: string, appointmentTime: string) => {
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const currentTime = new Date();
  const timeLimit = addMinutes(currentTime, 60);
  return isBefore(timeLimit, appointmentDateTime);
};

const handleCancelPress = (appointmentId: string, date: string, time: string) => {
  if (!canCancelAppointment(date, time)) {
    Alert.alert(
      'Cannot Cancel',
      'Appointments can only be cancelled 60 minutes before the scheduled time.'
    );
    return;
  }
  setSelectedAppointment(appointmentId);
  setShowCancelModal(true);
};
const handleReorderComplete = async (reorderedAppointments: Appointment[]) => {
  try {
    const changes = appointments.map((originalApt, index) => {
      const newApt = reorderedAppointments[index];
      if (originalApt.id !== newApt.id) {
        return {
          originalApt,
          newApt,
          originalIndex: index,
          newIndex: reorderedAppointments.findIndex(apt => apt.id === originalApt.id)
        };
      }
      return null;
    }).filter(Boolean);

    if (changes.length > 0) {
      const swap = changes[0]!;
      const apt1 = swap.originalApt;
      const apt2 = reorderedAppointments[swap.originalIndex];

      // Calculate end times based on service duration (assuming 30 minutes if not specified)
      const getEndTime = (startTime: string) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endMinutes = minutes + 30; // Default 30-minute duration
        const endHours = hours + Math.floor(endMinutes / 60);
        const finalMinutes = endMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}:00`;
      };

      const apt1EndTime = getEndTime(apt2.start_time);
      const apt2EndTime = getEndTime(apt1.start_time);

      const { error } = await supabase
        .from('appointments')
        .upsert([
          {
            id: apt1.id,
            date: apt1.date,
            start_time: apt2.start_time,
            end_time: apt1EndTime,
            service_id: apt1.service?.id,
            client_id: apt1.user_profile?.id,
            status: apt1.status
          },
          {
            id: apt2.id,
            date: apt2.date,
            start_time: apt1.start_time,
            end_time: apt2EndTime,
            service_id: apt2.service?.id,
            client_id: apt2.user_profile?.id,
            status: apt2.status
          }
        ]);

      if (error) throw error;

      // Refresh the appointments after successful swap
      await fetchAppointments();
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to update appointment times');
    console.error('Error updating appointment times:', error);
  }
};

const handleCancelConfirm = async () => {
  if (selectedAppointment) {
    await cancelAppointment(selectedAppointment);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  }
};


  if (isLoading) {
    return <LoadingScreen title="Appointments" onBack={() => navigation.goBack()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00796B" barStyle="light-content" />
      
      <Header 
        title="Appointments"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
        rightComponent={
          userRole === 'BUSINESS_MANAGER' && (
            <HeaderEditButton 
              isEditMode={isEditMode} 
              onPress={() => setIsEditMode(!isEditMode)} 
            />
          )
        }
      />

      {!isEditMode && (
        <AppointmentFilters
          selectedDate={selectedDate}
          selectedService={selectedService}
          services={services}
          showCalendar={showCalendar}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          onServiceSelect={setSelectedService}
          onCalendarToggle={() => setShowCalendar(!showCalendar)}
        />
      )}

      <AppointmentContent
        appointments={appointments}
        isLoading={isLoading}
        isEditMode={isEditMode}
        userRole={userRole}
        onRefresh={fetchAppointments}
        onCancelAppointment={handleCancelPress}
        canCancelAppointment={canCancelAppointment}
        onReorderComplete={handleReorderComplete}
        navigation={navigation}
      />

      <ConfirmationModal
        visible={showCancelModal}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        icon="event-busy"
        onCancel={() => {
          setShowCancelModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        confirmButtonColor="#D32F2F"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export default AppointmentListScreen;