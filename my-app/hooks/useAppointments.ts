import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Appointment } from '../types/Appointment';

export const useAppointments = (selectedDate: string, selectedService: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('business_id', businessId);
      
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'CANCELLED' })
        .eq('id', appointmentId);

      if (error) throw error;

      // Refresh appointments after cancellation
      await fetchAppointments();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };



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

      await fetchServices(businessData.id);
      
      let query = supabase
        .from('appointments')
        .select(`
          id,
          date,
          start_time,
          status,
          client_id,
          user_profile:client_id (
          id,
            name,
            phone
          ),
          service:service_id (
            id,
            name
          )
        `)
        .eq('service.business_id', businessData.id)
        .eq('date', selectedDate);

      if (selectedService !== 'all') {
        query = query.eq('service_id', selectedService);
      }

      const { data: appointmentsData, error: appointmentsError } = await query
        .order('start_time', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      const transformedData = appointmentsData?.map(apt => ({
        ...apt,
        user_profile: apt.user_profile || { name: 'Unknown', phone: 'N/A' },
        service: apt.service || { id: '', name: 'Unknown' }
      })) || [];

      setAppointments(transformedData);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, selectedService]);

  return { appointments, services, isLoading, fetchAppointments, cancelAppointment };
};