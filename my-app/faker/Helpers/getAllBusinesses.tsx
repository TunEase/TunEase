import { supabase } from "../../services/supabaseClient";

export const getAllBusineses = async () => {
  try {
    const { data, error } = await supabase.from("business").select("");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching event data:", error);
    return [];
  }
};
