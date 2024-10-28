// types/appointment.ts

export type Appointment = {
    id: string;              // Unique identifier for the appointment
    client_id: string;       // ID of the client who booked the appointment
    service_provider_id: string; // ID of the service provider
    date: string;            // Date of the appointment (e.g., '2024-10-25')
    start_time: string;      // Start time of the appointment (e.g., '10:00:00')
    end_time: string;  
    notes?: string;      // End time of the appointment (optional)
  status: "pending" | "confirmed" | "canceled"; // Status of the appointment
  created_at: string; // Timestamp when the appointment was created
  updated_at?: string; // Timestamp when the appointment was last updated (optional)
};
