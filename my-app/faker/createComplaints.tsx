import { getAllUsers } from "./Helpers/getAllUsers";
import { getAllServices } from "./Helpers/getAllServices";
import { getAllBusineses } from "./Helpers/getAllBusinesses";
import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";

// Define types for the data structures
interface Complaint {
  complainant_id: string; // Reference to the user who made the complaint
  business_id: string | null; // Reference to the business (can be null)
  service_id: string | null; // Reference to the service (can be null)
  description: string; // Description of the complaint
  status: string; // Status of the complaint
  assigned_to: string | null; // Reference to the user assigned to resolve the complaint
}

export const createComplaintsData = async () => {
  try {
    // Fetch data concurrently
    const services = await getAllServices();
    const businesses = await getAllBusineses();
    const users = await getAllUsers();

    const userIds = users.map((user) => user.id);
    const complaints: Complaint[] = [];

    // Generate complaints for services
    services.forEach((service: any) => {
      const numComplaints = Math.floor(Math.random() * 3) + 1; // Random number of complaints between 1 and 3
      for (let i = 0; i < numComplaints; i++) {
        complaints.push({
          complainant_id: faker.helpers.arrayElement(userIds), // Random user ID
          business_id: service.business_id, // Associate with the business of the service
          service_id: service.id,
          description: faker.lorem.sentence(), // Random complaint description
          status: "PENDING", // Default status
          assigned_to: faker.helpers.arrayElement(userIds), // Randomly assign to a user
        });
      }
    });

    // Generate complaints for businesses
    businesses.forEach((business: any) => {
      const numComplaints = Math.floor(Math.random() * 3) + 1; // Random number of complaints between 1 and 3
      for (let i = 0; i < numComplaints; i++) {
        complaints.push({
          complainant_id: faker.helpers.arrayElement(userIds), // Random user ID
          business_id: business.id,
          service_id: null, // No specific service for business complaints
          description: faker.lorem.sentence(), // Random complaint description
          status: "PENDING", // Default status
          assigned_to: faker.helpers.arrayElement(userIds), // Randomly assign to a user
        });
      }
    });

    // Insert complaint data into the database
    const { error } = await supabase.from("complaints").insert(complaints);
    if (error) {
      console.error("Error inserting complaint data:", error);
      return;
    }

    console.log("Complaint data created successfully");
  } catch (error) {
    console.error("Error creating complaint data:", error);
  }
};

// Call the function to create complaint data
createComplaintsData();
