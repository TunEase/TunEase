import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { addDays, format } from "date-fns";

import { getAllServices } from "./Helpers/getAllServices";

// Define types for the data structures
interface Availability {
  service_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
}

export const createAvailabilityData = async () => {
  try {
    // Fetch all services
    const services = await getAllServices();

    // Prepare availability data
    const availabilityData: Availability[] = [];

    // Function to generate availability entries
    const generateAvailabilityEntries = (serviceId: string) => {
      const startDate = new Date();
      const endDate = addDays(startDate, faker.number.int({ min: 30, max: 90 }));
      
      const startHour = faker.number.int({ min: 6, max: 12 });
      const endHour = faker.number.int({ min: startHour + 4, max: 22 });
      
      const daysOfWeek = faker.helpers.shuffle([0, 1, 2, 3, 4, 5, 6])
        .slice(0, faker.number.int({ min: 3, max: 7 }))
        .sort((a, b) => a - b);

      availabilityData.push({
        service_id: serviceId,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        start_time: `${startHour.toString().padStart(2, "0")}:00`,
        end_time: `${endHour.toString().padStart(2, "0")}:00`,
        days_of_week: daysOfWeek,
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