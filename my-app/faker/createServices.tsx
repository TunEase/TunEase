import { faker } from "@faker-js/faker";
import { supabase } from "../services/supabaseClient";
import { getAllBusineses } from "./Helpers/getAllBusinesses";

export const createService = async () => {
  // Fetch all businesses
  const businesses = await getAllBusineses();
  const businessIds = businesses.map((business: any) => business.id);

  // Create service rows
  const services = businessIds.flatMap((businessId) => {
    const numServices = Math.floor(Math.random() * 5) + 1; // Random number of services between 1 and 5
    return Array.from({ length: numServices }, () => {
      const duration = Math.floor(Math.random() * 60) + 30; // Random duration between 30 and 90 minutes

      // Generate random start time between 08:00 and 12:00
      const startHour = Math.floor(Math.random() * 5) + 8; // Random hour between 8 and 12
      const startMinute = Math.floor(Math.random() * 60); // Random minute between 0 and 59
      const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;

      // Calculate end time based on the duration
      const endTimeDate = new Date();
      endTimeDate.setHours(startHour, startMinute, 0); // Set end time to start time
      endTimeDate.setMinutes(endTimeDate.getMinutes() + duration); // Add duration to end time
      const endTime = `${String(endTimeDate.getHours()).padStart(2, "0")}:${String(endTimeDate.getMinutes()).padStart(2, "0")}`;

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 20, max: 120, dec: 2 })),
        duration, // Use the generated duration
        reordering: faker.helpers.arrayElement(["CUSTOM", "AUTOMATED"]),
        business_id: businessId,
        service_type: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
        processing_time: `${Math.floor(Math.random() * 72) + 1} hours`, // Random processing time up to 3 days
        start_time: startTime, // Set the generated start time
        end_time: endTime, // Set the calculated end time
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        disable_availability: faker.datatype.boolean(),
        disable_service: faker.datatype.boolean(),
        accept_cash: faker.datatype.boolean(),
        accept_card: faker.datatype.boolean(),
        accept_online: faker.datatype.boolean(),
        accept_cheque: faker.datatype.boolean(),
        accept_notification: faker.datatype.boolean(),
        accept_complaint: faker.datatype.boolean(),
        accept_review: faker.datatype.boolean(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      };
    });
  });

  // Insert service data into the database
  const { error: serviceError } = await supabase
    .from("services")
    .insert(services);

  if (serviceError) {
    console.error("Error inserting service data:", serviceError);
    return;
  }
  console.log("Service data created successfully");
};
