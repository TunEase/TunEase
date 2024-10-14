import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { faker } from "@faker-js/faker";

const expoConfig = Constants.expoConfig;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error("Supabase URL or API Key is missing");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Function to insert fake data
export const insertFakeData = async () => {
  const userId = "3cea4008-5684-4d68-820a-abb0af05d024"; // Example user ID

  // Generate businesses with realistic data
  const businesses = Array.from({ length: 5 }).map(() => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    address: faker.address.street(),
    business_type: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
    manager_id: userId,
    phone: faker.phone.number(),
    email: faker.internet.email(),
    website: faker.internet.url(),
    established_year: faker.date.past({years: 20}).getFullYear(), // Year established
  }));

  // Generate services with realistic data
  const services = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(10),
    price: parseFloat(faker.commerce.price()), // Price between $10 and $500
    duration: faker.number.int({ min: 30, max: 120 }), // Duration in minutes
    reordering: faker.helpers.arrayElement(['CUSTOM', 'STANDARD']),
    business_id: null, // To be assigned later
    service_type: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
  }));

  // Generate appointments with realistic data
  const appointments = Array.from({ length: 10 }).map(() => ({
    service_id: null, // To be assigned later
    client_id: userId,
    date: faker.date.future().toISOString().split("T")[0],
    start_time: faker.date.future().toTimeString().split(" ")[0],
    end_time: faker.date.future().toTimeString().split(" ")[0],
    status: faker.helpers.arrayElement(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
  }));

  // Generate complaints with realistic data
  const complaints = Array.from({ length: 5 }).map(() => ({
    complainant_id: userId,
    description: faker.lorem.sentence(5),
    status: faker.helpers.arrayElement(['PENDING', 'RESOLVED']),
  }));

  // Generate reviews with realistic data
  const reviews = Array.from({ length: 5 }).map(() => ({
    client_id: userId,
    business_id: null, // To be assigned later
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(8),
  }));

  // Start a transaction
  const { data: transactionData, error: transactionError } = await supabase
    .from("business")
    .insert(businesses)
    .select();

  if (transactionError) {
    console.error("Error inserting businesses:", transactionError);
    return; // Exit if there's an error
  }

  const insertedBusinesses = transactionData;

  // Insert services with valid business_id
  for (const service of services) {
    const business =
      insertedBusinesses[Math.floor(Math.random() * insertedBusinesses.length)];
    service.business_id = business.id;
  }

  const { error: serviceError } = await supabase
    .from("services")
    .insert(services);
  if (serviceError) {
    console.error("Error inserting services:", serviceError);
    return; // Exit if there's an error
  }

  // Insert appointments with valid service_id and client_id
  const { data: servicesData, error: servicesError } = await supabase
    .from("services")
    .select("id");
  if (servicesError) {
    console.error("Error fetching services:", servicesError);
    return; // Exit if there's an error
  }

  const serviceIds = servicesData.map((service) => service.id);
  for (const appointment of appointments) {
    appointment.service_id =
      serviceIds[Math.floor(Math.random() * serviceIds.length)];
  }

  const { error: appointmentError } = await supabase
    .from("appointments")
    .insert(appointments);
  if (appointmentError) {
    console.error("Error inserting appointments:", appointmentError);
    return; // Exit if there's an error
  }

  // Insert complaints
  const { error: complaintError } = await supabase
    .from("complaints")
    .insert(complaints);
  if (complaintError) {
    console.error("Error inserting complaints:", complaintError);
    return; // Exit if there's an error
  }

  // Insert reviews
  for (const review of reviews) {
    const business =
      insertedBusinesses[Math.floor(Math.random() * insertedBusinesses.length)];
    review.business_id = business.id;
  }

  const { error: reviewError } = await supabase.from("reviews").insert(reviews);
  if (reviewError) {
    console.error("Error inserting reviews:", reviewError);
    return; // Exit if there's an error
  }

  console.log("Sample data inserted successfully!");
};

// Example usage
insertFakeData();