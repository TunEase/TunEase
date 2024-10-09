import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
// import { SUPABASE_URL, SUPABASE_API_KEY } from "@env";


// Get the expoConfig safely
const expoConfig = Constants.expoConfig;
console.log('process',process.env.SUPABASE_URL);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error('Supabase URL or API Key is missing');
}

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// Function to insert sample data
export const insertSampleData = async () => {
  const users = [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'hashed_password1', role: 'CLIENT', phone: '123-456-7890' },
    { name: 'Bob Smith', email: 'bob.smith@example.com', password: 'hashed_password2', role: 'BUSINESS_MANAGER', phone: '234-567-8901' },
    { name: 'Charlie Brown', email: 'charlie.brown@example.com', password: 'hashed_password3', role: 'ADMIN', phone: '345-678-9012' },
    { name: 'Dana White', email: 'dana.white@example.com', password: 'hashed_password4', role: 'CLIENT', phone: '456-789-0123' },
    { name: 'Evan Davis', email: 'evan.davis@example.com', password: 'hashed_password5', role: 'BUSINESS_MANAGER', phone: '567-890-1234' },
    { name: 'Fiona Green', email: 'fiona.green@example.com', password: 'hashed_password6', role: 'ADMIN', phone: '678-901-2345' },
    { name: 'George Martin', email: 'george.martin@example.com', password: 'hashed_password7', role: 'CLIENT', phone: '789-012-3456' },
    { name: 'Hannah Lee', email: 'hannah.lee@example.com', password: 'hashed_password8', role: 'CLIENT', phone: '890-123-4567' },
    { name: 'Ian Brown', email: 'ian.brown@example.com', password: 'hashed_password9', role: 'BUSINESS_MANAGER', phone: '901-234-5678' },
    { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'hashed_password10', role: 'CLIENT', phone: '012-345-6789' }
  ];

  const businesses = [
    { name: 'City Hospital', description: 'Provides comprehensive health services.', address: '123 Health St, City', business_type: 'PUBLIC', manager_id: null, phone: '123-456-7890', email: 'info@cityhospital.example.com' },
    { name: 'Local Police Stati on', description: 'Maintains law and order.', address: '456 Law St, City', business_type: 'PUBLIC', manager_id: null, phone: '234-567-8901', email: 'info@localpolice.example.com' },
    { name: 'Downtown Library', description: 'A hub for knowledge and learning.', address: '789 Book Ave, City', business_type: 'PUBLIC', manager_id: null, phone: '345-678-9012', email: 'info@downtownlibrary.example.com' },
    { name: 'City Park Services', description: 'Manages and maintains public parks.', address: '321 Park Rd, City', business_type: 'PUBLIC', manager_id: null, phone: '456-789-0123', email: 'info@cityparkservices.example.com' },
    { name: 'ABC Construction', description: 'Provides construction and repair services.', address: '654 Build St, City', business_type: 'PRIVATE', manager_id: null, phone: '567-890-1234', email: 'info@abcconstruction.example.com' },
    { name: 'XYZ Electric', description: 'Specializes in electrical services.', address: '987 Power Dr, City', business_type: 'PRIVATE', manager_id: null, phone: '678-901-2345', email: 'info@xyzelectric.example.com' },
    { name: 'Happy Paws Vet Clinic', description: 'Cares for your furry friends.', address: '246 Animal St, City', business_type: 'PRIVATE', manager_id: null, phone: '789-012-3456', email: 'info@happypawsvetclinic.example.com' },
    { name: 'Local Gym', description: 'Offers fitness classes and personal training.', address: '135 Fitness Blvd, City', business_type: 'PRIVATE', manager_id: null, phone: '890-123-4567', email: 'info@localgym.example.com' },
    { name: 'Fine Dine Restaurant', description: 'A place for exquisite dining experiences.', address: '159 Food St, City', business_type: 'PRIVATE', manager_id: null, phone: '012-345-6789', email: 'info@finedinerestaurant.example.com' },
    { name: 'Tech Solutions', description: 'Provides tech support and solutions.', address: '753 Tech St, City', business_type: 'PRIVATE', manager_id: null, phone: '246-135-7890', email: 'info@techsolutions.example.com' }
  ];

  const services = [
    { name: 'General Consultation', description: 'Basic health check and consultation.', price: 50.00, duration: 30, reordering: 'CUSTOM', business_id: null, service_type: 'PUBLIC' },
    { name: 'Emergency Services', description: '24/7 emergency medical assistance.', price: 200.00, duration: 120, reordering: 'AUTOMATED', business_id: null, service_type: 'PUBLIC' },
    { name: 'Building Permit', description: 'Obtain permits for construction projects.', price: 150.00, duration: 45, reordering: 'CUSTOM', business_id: null, service_type: 'PUBLIC' },
    { name: 'Electrical Repair', description: 'Fix electrical issues in your home.', price: 75.00, duration: 60, reordering: 'AUTOMATED', business_id: null, service_type: 'PRIVATE' },
    { name: 'Pet Checkup', description: 'Regular health check for your pets.', price: 40.00, duration: 30, reordering: 'CUSTOM', business_id: null, service_type: 'PRIVATE' },
    { name: 'Personal Training', description: 'One-on-one fitness training sessions.', price: 60.00, duration: 60, reordering: 'AUTOMATED', business_id: null, service_type: 'PRIVATE' },
    { name: 'Fine Dining Experience', description: 'Enjoy a gourmet meal.', price: 100.00, duration: 120, reordering: 'CUSTOM', business_id: null, service_type: 'PRIVATE' },
    { name: 'Tech Support', description: 'Get help with your tech issues.', price: 50.00, duration: 30, reordering: 'AUTOMATED', business_id: null, service_type: 'PRIVATE' },
    { name: 'Community Workshop', description: 'Participate in local community workshops.', price: 10.00, duration: 90, reordering: 'CUSTOM', business_id: null, service_type: 'PUBLIC' },
    { name: 'Yoga Class', description: 'Join our relaxing yoga sessions.', price: 20.00, duration: 60, reordering: 'AUTOMATED', business_id: null, service_type: 'PRIVATE' }
  ];

  const appointments = [
    { service_id: null, client_id: null, date: '2024-10-15', start_time: '10:00:00', end_time: '10:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-16', start_time: '11:00:00', end_time: '11:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-17', start_time: '12:00:00', end_time: '12:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-18', start_time: '13:00:00', end_time: '13:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-19', start_time: '14:00:00', end_time: '14:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-20', start_time: '15:00:00', end_time: '15:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-21', start_time: '16:00:00', end_time: '16:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-22', start_time: '17:00:00', end_time: '17:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-23', start_time: '18:00:00', end_time: '18:30:00', status: 'SCHEDULED' },
    { service_id: null, client_id: null, date: '2024-10-24', start_time: '19:00:00', end_time: '19:30:00', status: 'SCHEDULED' }
  ];

  const complaints = [
    { user_id: null, description: 'Delayed service at the hospital.', status: 'PENDING' },
    { user_id: null, description: 'Unresolved issue with the electrical repair.', status: 'PENDING' },
    { user_id: null, description: 'Pet health check was not satisfactory.', status: 'PENDING' },
    { user_id: null, description: 'Gym class was overcrowded.', status: 'PENDING' },
    { user_id: null, description: 'Restaurant staff was unprofessional.', status: 'PENDING' }
  ];

  const reviews = [
    { user_id: null, business_id: null, rating: 5, comment: 'Excellent service and friendly staff!' },
    { user_id: null, business_id: null, rating: 4, comment: 'Very good experience overall.' },
    { user_id: null, business_id: null, rating: 3, comment: 'Average service, could improve.' },
    { user_id: null, business_id: null, rating: 2, comment: 'Not satisfied with the service.' },
    { user_id: null, business_id: null, rating: 1, comment: 'Terrible experience, will not return.' }
  ];

  // Insert users and retrieve their IDs
  // const insertedUsers: any[] = [];
  // for (const user of users) {
  //   const { data, error } = await supabase.from('users').insert([user]).select(); // .select() returns the inserted row with IDs
  //   if (error) {
  //     console.error('Error inserting user:', error);
  //   } else {
  //     insertedUsers.push(data[0]); // Store the entire inserted user object for easy access later
  //   }
  // }
// Insert businesses and retrieve their IDs
// const insertedBusinesses: any[] = [];
// for (const business of businesses) {
//   const manager = insertedUsers.find(user => user.role === 'BUSINESS_MANAGER');
//   business.manager_id = manager ? manager.id : null;
//   const { data, error } = await supabase.from('business').insert([business]).select();
//   if (error) {
//     console.error('Error inserting business:', error);
//   } else {
//     insertedBusinesses.push(data[0]); // Store the inserted business with its ID
//   }
// }

// Insert services with valid business_id
// for (const service of services) {
//   const business = insertedBusinesses[Math.floor(Math.random() * insertedBusinesses.length)];
//   service.business_id = business.id; // Assign a random business_id from the inserted businesses
//   const { data, error } = await supabase.from('services').insert([service]);
//   if (error) console.error('Error inserting service:', error);
// }

// Insert appointments with valid service_id and client_id
// for (const appointment of appointments) {
//   const service = await supabase.from('services').select('id').single();
//   const client = insertedUsers.find(user => user.role === 'CLIENT');
//   appointment.service_id = service?.data?.id;
//   appointment.client_id = client ? client.id : null;
//   const { data, error } = await supabase.from('appointments').insert([appointment]);
//   if (error) console.error('Error inserting appointment:', error);
// }

// // Insert complaints with valid user_id
// for (const complaint of complaints) {
//   const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
//   complaint.user_id = user.id;
//   const { data, error } = await supabase.from('complaints').insert([complaint]);
//   if (error) console.error('Error inserting complaint:', error);
// }

// // Insert reviews with valid user_id and business_id
// for (const review of reviews) {
//   const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
//   const business = insertedBusinesses[Math.floor(Math.random() * insertedBusinesses.length)];
//   review.user_id = user.id;
//   review.business_id = business.id;
//   const { data, error } = await supabase.from('reviews').insert([review]);
//   if (error) console.error('Error inserting review:', error);
// }

console.log('Sample data inserted successfully!');
};
