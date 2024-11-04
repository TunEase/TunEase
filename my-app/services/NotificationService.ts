// services/notificationsService.ts

export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}






















// import { supabase } from '../services/supabaseClient';
// import { format } from 'date-fns';
// import { Appointment } from '../types/Appointment';

// export const NotificationService = {
//   sendReschedulingNotification: async (
//     appointment: Appointment,
//     newDate: string,
//     newTime: string
//   ) => {
//     try {
//       const { data: userData, error: userError } = await supabase
//         .from('user_profile')
//         .select('id')
//         .eq('id', appointment.user_profile?.id)
//         .single();

//       if (userError) throw userError;

//       const message = `Your appointment for ${appointment.service?.name} has been rescheduled to ${format(new Date(newDate), 'MMM dd, yyyy')} at ${format(new Date(`2000-01-01T${newTime}`), 'h:mm a')}. Please confirm or reschedule.`;

//       await supabase.from('notifications').insert({
//         user_id: userData.id,
//         message,
//         type: 'RESCHEDULE_CONFIRMATION',
//         appointment_id: appointment.id,
//         is_read: false,
//         action_required: true,
//         new_date: newDate,
//         new_time: newTime
//       });
//     } catch (error) {
//       console.error('Error sending notification:', error);
//     }
//   }
// };