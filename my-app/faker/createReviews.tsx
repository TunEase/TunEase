import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { getAllUsers } from "./Helpers/getAllUsers";
import { getAllServices } from "./Helpers/getAllServices";
import { getAllBusineses } from "./Helpers/getAllBusinesses"; // Assuming you have a function to get all businesses

// Define types for the data structures
interface Review {
  client_id?: string | null; // Reference to the client
  service_id?: string | null; // Reference to the service
  business_id?: string | null; // Reference to the business
  rating: number; // Rating between 1 and 5
  comment: string; // Review comment
}

export const createReviewData = async () => {
  try {
    // Fetch all services and businesses
    const services = await getAllServices();
    const businesses = await getAllBusineses();
    const users = await getAllUsers();
    const userIds = users.map((user) => user.id);
    // Prepare review data
    const reviewData: Review[] = [];

    // Generate reviews for each service and business
    services.forEach((service: any) => {
      const numReviews = Math.floor(Math.random() * 5) + 1; // Random number of reviews between 1 and 5
      for (let i = 0; i < numReviews; i++) {
        reviewData.push({
          client_id: faker.helpers.arrayElement(userIds), // Generate a fake client ID
          service_id: service.id,

          rating: faker.number.int({ min: 1, max: 5 }), // Random rating between 1 and 5
          comment: faker.lorem.sentence(), // Generate a random comment
        });
      }
    });

    // Generate reviews for each business
    businesses.forEach((business: any) => {
      const numReviews = Math.floor(Math.random() * 5) + 1; // Random number of reviews between 1 and 5
      for (let i = 0; i < numReviews; i++) {
        reviewData.push({
          client_id: faker.helpers.arrayElement(userIds), // Generate a fake client ID
          service_id: null, // No specific service for business reviews
          business_id: business.id,
          rating: faker.number.int({ min: 1, max: 5 }), // Random rating between 1 and 5
          comment: faker.lorem.sentence(), // Generate a random comment
        });
      }
    });

    // Insert review data into the database
    const { error } = await supabase.from("reviews").insert(reviewData);
    if (error) {
      console.error("Error inserting review data:", error);
      return;
    }

    console.log("Review data created successfully");
  } catch (error) {
    console.error("Error creating review data:", error);
  }
};

// Call the function to create review data
createReviewData();
