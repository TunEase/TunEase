import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { fetchImages } from "./Helpers/fetchImages"; // Import the fetchImages function

import { getAllUsers } from "./Helpers/getAllUsers";
import { getAllServices } from "./Helpers/getAllServices";
import { getAllBusineses } from "./Helpers/getAllBusinesses"; // Assuming you have a function to get all businesses
import { getAllReviews } from "./Helpers/getAllReviews"; // Assuming you have a function to get all reviews
import { getAllFees } from "./Helpers/getAllFees"; // Assuming you have a function to get all fees
// Define the type for a media entry
interface MediaEntry {
  user_profile_id: string; // Assuming UUIDs are strings
  business_id?: string; // Optional for media not related to businesses
  service_id?: string; // Optional for media not related to services
  review_id?: string; // Optional for media not related to reviews
  media_type: string;
  media_url: string;
  fee_id?: string; // Optional for media not related to fees
  created_at: string; // ISO string
}

// Function to inject fake media and insert into Supabase
export const injectMedia = async (): Promise<void> => {
  // Fetch data concurrently
  const [users, businesses, services, reviews, fees] = await Promise.all([
    getAllUsers(),
    getAllBusineses(),
    getAllServices(),
    getAllReviews(),
    getAllFees(),
  ]);

  const mediaEntries: MediaEntry[] = []; // Array to hold media entries

  // Generate media entries for businesses
  for (const business of businesses) {
    // @ts-ignore
    const imageUrls = await fetchImages(
      "administration ambassy police station court",
      5
    ); // Fetch images based on business name
    imageUrls.forEach((imageUrl) => {
      const mediaEntry: MediaEntry = {
        user_profile_id: faker.helpers.arrayElement(users).id, // Randomly assign a user
        // @ts-ignore

        business_id: business.id, // Assign the current business
        media_type: "image", // Default media type
        media_url: imageUrl, // Use the fetched image URL
        created_at: new Date().toISOString(),
      };
      mediaEntries.push(mediaEntry);
    });
  }

  // Generate media entries for services
  for (const service of services) {
    // @ts-ignore

    const imageUrls = await fetchImages(
      "custmer services offices private company agencies",
      5
    ); // Fetch images based on service name
    imageUrls.forEach((imageUrl) => {
      const mediaEntry: MediaEntry = {
        user_profile_id: faker.helpers.arrayElement(users).id, // Randomly assign a user
        // @ts-ignore

        service_id: service.id, // Assign the current service
        media_type: "image", // Default media type
        media_url: imageUrl, // Use the fetched image URL
        created_at: new Date().toISOString(),
      };
      mediaEntries.push(mediaEntry);
    });
  }

  // Generate media entries for reviews
  for (const review of reviews) {
    const imageUrls = await fetchImages(review.title, 5); // Fetch images based on review title
    imageUrls.forEach((imageUrl) => {
      const mediaEntry: MediaEntry = {
        user_profile_id: faker.helpers.arrayElement(users).id, // Randomly assign a user
        review_id: review.id, // Assign the current review
        media_type: "image", // Default media type
        media_url: imageUrl, // Use the fetched image URL
        created_at: new Date().toISOString(),
      };
      mediaEntries.push(mediaEntry);
    });
  }

  // Insert media entries into Supabase
  const { data, error } = await supabase.from("media").insert(mediaEntries);

  if (error) {
    console.error("Error inserting media entries:", error);
  } else {
    console.log("Inserted media entries:", data);
  }
};
