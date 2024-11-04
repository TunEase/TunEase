// types/appointment.ts
import { Service, User_profile } from "./business";

export interface Appointment {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING_CONFIRMATION';
  user_profile?: {
    id: string;
    name: string;
    phone: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
  };
  notifications_enabled: boolean;
}

// interface Service {
//   name: string;
//   duration: number;
//   price: number;
//   start_time?: string;
//   end_time?: string;
// }
// interface UserProfile {
//   name: string;
//   email: string;
//   phone: string;
// }
