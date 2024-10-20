import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { getAllServices } from "./Helpers/getAllServices";
export const createFees = async () => {

  const services = await getAllServices();
  // Create fee rows
  const fees = services.flatMap((service) => 
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      fee: parseFloat(faker.commerce.price({ min: 5, max: 50, dec: 2 })),
      name: faker.finance.accountName() + " Fee",
      description: faker.lorem.sentence(),
      // @ts-ignore
      service_id: service.id,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }))
  );

  // Insert fee data into the database
  const { error: feeError } = await supabase
    .from("fees")
    .insert(fees);

  if (feeError) {
    console.error("Error inserting fee data:", feeError);
    return;
  }
  console.log("Fee data created successfully");

  }


// Example usage
// createFees();