import { supabase } from "../services/supabaseClient";
import { createAvailabilityData } from "./addAvailabilty";
import { createBusiness } from "./createBusinesses";
import { createComplaintsData } from "./createComplaints";
import { createEligibility } from "./createEligibility";
import { createFees } from "./createFees";
import { injectMedia } from "./createImages";
import { createReviewData } from "./createReviews";
import { createService } from "./createServices";
import { addNews } from "./addNews";
import { createRoomsAndMessages } from "./createRoomsAndMessages";
import { seedNews } from "./addNews";
import { addMediaToNews } from "./addMediaToNews";
const dropTablesExceptUsers = async () => {
  const tablesToDrop = [
    "media",
    "reviews",
    "complaints",
    "availability",
    "services",
    "business",
    "eligibility",
    "fees",
    // Add other tables you want to drop here
  ];

  for (const table of tablesToDrop) {
    // @ts-ignore
    const { error } = await supabase
      .from(table)
      .delete() // Optionally delete all rows before dropping the table
      .then(async () => {
        const { error: dropError } = await supabase.rpc("drop_table", {
          table_name: table,
        });
        if (dropError) {
          console.error(`Error dropping table ${table}: ${dropError}`);
        } else {
          console.log(`Dropped table ${table}`);
        }
      });

    if (error) {
      console.error(`Error dropping data from ${table}: ${error}`);
    }
  }
};
// Main function to run all operations in order
const runAllFunctions = async () => {
  await createRoomsAndMessages();
  // await createBusiness(); // Create businesses
  // await createService(); // Create services
  // await createAvailabilityData(); // Create availability data
  // await addNews();
  await seedNews();
  // await addMediaToNews();
  // await createComplaintsData(); // Create complaints data
  // await createReviewData(); // Create review data
  // await createEligibility(); // Create eligibility
  // await createFees(); // Create fees
  // await injectMedia(); // Inject media
};

// Execute the main function
runAllFunctions()
  .then(() => {
    console.log("All functions executed successfully.");
  })
  .catch((error) => {
    console.error(`Error executing functions: ${error}`);
  });
