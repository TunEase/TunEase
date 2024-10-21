import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { getAllServices } from "./Helpers/getAllServices";
export const createEligibility = async () => {
  const services = await getAllServices();
  // Create eligibility rows
  const eligibilities = services.flatMap((service) => 
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      name: faker.company.buzzPhrase() + " eligibility", // Random eligibility name
      description: faker.lorem.paragraph(), // Random description
      // @ts-ignore
      service_id: service.id,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
        }))
  );

  // Insert eligibility data into the database
  const { data: insertedEligibilities, error: eligibilityError } = await supabase
    .from("eligibility")
    .insert(eligibilities)
    .select();

  if (eligibilityError) {
    console.error("Error inserting eligibility data:", eligibilityError);
    return;
  }
  console.log("Eligibility data created successfully");


};

// Example usage
// createEligibility();