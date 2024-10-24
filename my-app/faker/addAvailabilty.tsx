import { faker } from "@faker-js/faker";
import { addDays, format } from "date-fns";
import { supabase } from "../services/supabaseClient";
import { getAllServices } from "./Helpers/getAllServices";

// Define types for the data structures
interface Availability {
  service_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  days_of_week: number[];
}

export const createAvailabilityData = async () => {
  try {
    // Fetch all services
    const services = await getAllServices();

    // Prepare availability data
    const availabilityData: Availability[] = [];

    // Function to generate availability entries
    const generateAvailabilityEntries = (
      serviceId: string,
      serviceStartTime: string,
      serviceEndTime: string,
      serviceDuration: number
    ) => {
      const startDate = new Date();
      const endDate = addDays(startDate, faker.number.int({ min: 30, max: 90 }));

      // Convert service start and end times to Date objects
      const [startHour, startMinute] = serviceStartTime.split(":").map(Number);
      const [endHour, endMinute] = serviceEndTime.split(":").map(Number);

      const startTime = new Date(startDate);
      startTime.setHours(startHour, startMinute, 0);

      const endTime = new Date(startDate);
      endTime.setHours(endHour, endMinute, 0);

      // Ensure availability times are within the service time range
      const availabilityStartTime = new Date(
        startTime.getTime() +
        Math.random() * (endTime.getTime() - startTime.getTime() - serviceDuration * 60 * 1000)
      );
      const availabilityEndTime = new Date(availabilityStartTime.getTime() + serviceDuration * 60 * 1000);

      const daysOfWeek = faker.helpers
        .shuffle([0, 1, 2, 3, 4, 5, 6])
        .slice(0, faker.number.int({ min: 3, max: 7 }))
        .sort((a, b) => a - b);

      availabilityData.push({
        service_id: serviceId,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        start_time: format(availabilityStartTime, "HH:mm"),
        end_time: format(availabilityEndTime, "HH:mm"),
        duration: serviceDuration,
        days_of_week: daysOfWeek,
      });
    };

    // Generate availability for each service
    services.forEach((service: any) => {
      generateAvailabilityEntries(
        service.id,
        service.start_time,
        service.end_time,
        service.duration
      );
    });

    // Insert availability data into the database
    const { error } = await supabase
      .from("availability")
      .upsert(availabilityData, {
        onConflict: 'service_id, start_date, end_date, start_time, end_time',
        
      });

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
// createAvailabilityData();