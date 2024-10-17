import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

import { getAllServices } from "./Helpers/getAllServices";

// Define types for the data structures
interface Availability {
  service_id: string; // Reference to the service
  start_time: string; // Time in HH:mm format
  end_time: string; // Time in HH:mm format
  day_of_week: string; // Day of the week
}

export const createAvailabilityData = async () => {
  try {
    // Fetch all services
    const services = await getAllServices();

    // Prepare availability data
    const availabilityData: Availability[] = [];

    // Function to generate availability entries for the next week
    const generateAvailabilityEntries = (serviceId: string) => {
      const daysOfWeek = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];
      daysOfWeek.forEach((day) => {
        const startHour = 9; // Example start hour (9 AM)
        const endHour = 17; // Example end hour (5 PM)
        const startDate = new Date(0, 0, 0, startHour, 0);
        const endDate = new Date(0, 0, 0, endHour, 0);
        const randomTime = new Date(
          startDate.getTime() +
            Math.random() * (endDate.getTime() - startDate.getTime())
        );
        availabilityData.push({
          service_id: serviceId,
          start_time: `${randomTime.getHours().toString().padStart(2, "0")}:00`, // Format start time
          end_time: `${(randomTime.getHours() + 1).toString().padStart(2, "0")}:00`, // Format end time (1 hour later)
          day_of_week: day, // Day of the week
        });
      });
    };

    // Generate availability for each service
    services.forEach((service: any) => {
      generateAvailabilityEntries(service.id);
    });

    // Insert availability data into the database
    const { error } = await supabase
      .from("availability")
      .insert(availabilityData);
    if (error) {
      console.error("Error inserting availability data:", error);
      return;
    }

    console.log("Availability data created successfully");
  } catch (error) {
    console.error("Error creating availability data:", error);
  }
};

// Call the function to create availability data
createAvailabilityData();
