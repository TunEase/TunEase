import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

import { getAllBusineses } from "./Helpers/getAllBusinesses";

export const createService = async () => {
  // Fetch all businesses
  const businesses = await getAllBusineses();
  const businessIds = businesses.map((business: any) => business.id);

  // Create service rows
  const services = businessIds.flatMap((businessId) => {
    const numServices = Math.floor(Math.random() * 5) + 1; // Random number of services between 1 and 5
    return Array.from({ length: numServices }, (_, index) => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat((Math.random() * 100 + 20).toFixed(2)), // Random price between 20.00 and 120.00
      duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30 and 90 minutes
      reordering: faker.helpers.arrayElement(["CUSTOM", "AUTOMATED"]),
      business_id: businessId, // Associate service with the current business
      service_type: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
      created_at: new Date(),
      updated_at: new Date(),
      }));
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

// Example usage
