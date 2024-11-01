// types/appointment.ts

export interface Appointment {
  id: string;
  date: string;
  start_time: string;
  user_profile?: {
    name: string;
    phone: string;
  };
  service?: {
    id: string;
    name: string;
  };
}

interface Service {
  name: string;
  duration: number;
  price: number;
  start_time?: string;
  end_time?: string;
}
interface UserProfile {
  name: string;
  email: string;
  phone: string;
}