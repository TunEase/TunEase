import { supabase } from "../../services/supabaseClient";
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase.from("services").select("");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching services data:", error);
    return [];
  }
};
