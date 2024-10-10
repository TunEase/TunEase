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

const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    return null;
  }

  console.log("User logged in:", data.user);
  return data.user;
};

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.log("error.message", error);
    return;
  }
  console.log("sinup  rigth", data);
  return data;
};
// signUp("jdididaoud404@gmail.com", "majid@");

export const insertFakeData = async () => {
  const userId = "3cea4008-5684-4d68-820a-abb0af05d024"; // Example user ID

  const businesses = Array.from({ length: 5 }).map(() => ({
    name: faker.company.name(),
    description: faker.company.buzzAdjective(),
    address: faker.location.streetAddress(),
    business_type: "PUBLIC",
    manager_id: userId,
    phone: faker.phone.number(),
    email: faker.internet.email(),
  }));

  const services = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: parseFloat(faker.commerce.price()),
    duration: faker.number.int({ min: 10, max: 60 }),
    reordering: "CUSTOM",
    business_id: null, // To be assigned later
    service_type: "PUBLIC",
  }));

  const appointments = Array.from({ length: 10 }).map(() => ({
    service_id: null, // To be assigned later
    client_id: userId,
    date: faker.date.future().toISOString().split("T")[0],
    start_time: faker.date.future().toTimeString().split(" ")[0],
    end_time: faker.date.future().toTimeString().split(" ")[0],
    status: "SCHEDULED",
  }));

  const complaints = Array.from({ length: 5 }).map(() => ({
    complainant_id: userId,
    description: faker.lorem.sentence(),
    status: "PENDING",
  }));

  const reviews = Array.from({ length: 5 }).map(() => ({
    client_id: userId,
    business_id: null, // To be assigned later
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
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
    await supabase
      .from("business")
      .delete()
      .in(
        "id",
        insertedBusinesses.map((b) => b.id)
      ); // Clean up businesses
    return; // Exit if there's an error
  }

  // Insert appointments with valid service_id and client_id
  const { data: servicesData, error: servicesError } = await supabase
    .from("services")
    .select("id");
  if (servicesError) {
    console.error("Error fetching services:", servicesError);
    await supabase
      .from("business")
      .delete()
      .in(
        "id",
        insertedBusinesses.map((b) => b.id)
      ); // Clean up businesses
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
    await supabase
      .from("services")
      .delete()
      .in(
        "id",
        services.map((s: any) => s.id)
      ); // Clean up services
    await supabase
      .from("business")
      .delete()
      .in(
        "id",
        insertedBusinesses.map((b) => b.id)
      ); // Clean up businesses
    return; // Exit if there's an error
  }

  // Insert complaints
  const { error: complaintError } = await supabase
    .from("complaints")
    .insert(complaints);
  if (complaintError) {
    console.error("Error inserting complaints:", complaintError);
    await supabase
      .from("appointments")
      .delete()
      .in(
        "id",
        appointments.map((a: any) => a.id)
      ); // Clean up appointments
    await supabase
      .from("services")
      .delete()
      .in(
        "id",
        services.map((s: any) => s.id)
      ); // Clean up services
    await supabase
      .from("business")
      .delete()
      .in(
        "id",
        insertedBusinesses.map((b) => b.id)
      ); // Clean up businesses
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
    await supabase
      .from("complaints")
      .delete()
      .in(
        "id",
        complaints.map((c: any) => c.id)
      ); // Clean up complaints
    await supabase
      .from("appointments")
      .delete()
      .in(
        "id",
        appointments.map((a: any) => a.id)
      ); // Clean up appointments
    await supabase
      .from("services")
      .delete()
      .in(
        "id",
        services.map((s: any) => s.id)
      ); // Clean up services
    await supabase
      .from("business")
      .delete()
      .in(
        "id",
        insertedBusinesses.map((b) => b.id)
      ); // Clean up businesses
    return; // Exit if there's an error
  }

  console.log("Sample data inserted successfully!");
 
};

// Example usage
insertFakeData();

// Example usage
// insertFakeData();