import { supabase } from "../services/supabaseClient";
import { faker } from "@faker-js/faker";
import { getAllUsers } from "./Helpers/getAllUsers";
import { getAllBusineses } from "./Helpers/getAllBusinesses";
const createConversations = async (numConversations: number) => {
  const users = await getAllUsers();
  const businesses = await getAllBusineses();
  if (users.length < 2) {
    console.error("Not enough users to create conversations.");
    return;
  }

  for (let i = 0; i < businesses.length; i++) {
    const businessUser = businesses[i];
    const clientUser = users[i];

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        business_id: businessUser.id, // Replace with actual business IDs
        user_profile_id: clientUser.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error(`Error creating conversation: ${error.message}`);
    } else {
      //@ts-ignore
      console.log(`Created conversation: ${conversation.id}`);
      //@ts-ignore
      await createMessages(
        5,
        conversation.id,
        businessUser.manager_id,
        clientUser.id
      );
    }
  }
};

const createMessages = async (
  numMessages: number,
  conversationId: string,
  senderId: string,
  receiverId: string
) => {
  for (let i = 0; i < numMessages; i++) {
    const { error } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender_id: i % 2 === 0 ? senderId : receiverId,
        receiver_id: i % 2 === 0 ? receiverId : senderId,
        content: faker.lorem.sentence(),
      },
    ]);

    if (error) {
      console.error(`Error creating message: ${error.message}`);
    } else {
      console.log(`Created message in conversation: ${conversationId}`);
    }
  }
};

// Main function to run all operations in order
export const createRoomsAndMessages = async () => {
  await createConversations(10); // Create 10 conversations
};
