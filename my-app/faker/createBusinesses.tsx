import { faker } from "@faker-js/faker";
import { supabase } from "../services/supabaseClient";
import { getAllUsers } from "./Helpers/getAllUsers";

// ... existing code ...

export const createBusiness = async () => {
  // Fetch all users to assign to events
  const users = await getAllUsers();
  const userIds = users.map((user) => user.id);

  // Prepare events for each subcategory
  const businesses = users.map((sub) => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    address: faker.location.streetAddress(),
    business_type: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
    manager_id: sub.id, // Assuming you want to set this to null for now
    phone: faker.phone.number(),
    email: faker.internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
  }));

  // Insert businesses into the database
  const { error: eventError } = await supabase
    .from("business")
    .insert(businesses);
  if (eventError) {
    console.error(`Error inserting businesses:`, eventError);
    return;
  }
  console.log(`businesses  created successfully`);
};
