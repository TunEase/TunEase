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
    return Array.from({ length: numServices }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 20, max: 120, dec: 2 })),
      duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30 and 90 minutes
      reordering: faker.helpers.arrayElement(["CUSTOM", "AUTOMATED"]),
      business_id: businessId,
      service_type: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
      processing_time: `${Math.floor(Math.random() * 72) + 1} hours`, // Random processing time up to 3 days
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

// // Generate media entries for fees
// for (const fee of fees) {
//   const imageUrls = await fetchImages('fees', 5); // Fetch images based on fee name
//   imageUrls.forEach((imageUrl) => {
//     const mediaEntry: MediaEntry = {
//       user_profile_id: faker.helpers.arrayElement(users).id, 
//       // @ts-ignore
//       fee_id: fee.id, // Assign the current fee
//       media_type: "image", // Default media type
//       media_url: imageUrl, // Use the fetched image URL
//       created_at: new Date().toISOString(),
//     };
//     mediaEntries.push(mediaEntry);
//     });
//   }
};
