import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import { Appointment } from '../types/Appointment';

export const NotificationService = {
  sendReschedulingNotification: async (
    appointment: Appointment,
    newDate: string,
    newTime: string
  ) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('user_profile')
        .select('id')
        .eq('id', appointment.user_profile?.id)
        .single();

      if (userError) throw userError;

      const message = `Your appointment for ${appointment.service?.name} has been rescheduled to ${format(new Date(newDate), 'MMM dd, yyyy')} at ${format(new Date(`2000-01-01T${newTime}`), 'h:mm a')}. Please confirm or reschedule.`;

      await supabase.from('notifications').insert({
        user_id: userData.id,
        message,
        type: 'RESCHEDULE_CONFIRMATION',
        appointment_id: appointment.id,
        is_read: false,
        action_required: true,
        new_date: newDate,
        new_time: newTime
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
};