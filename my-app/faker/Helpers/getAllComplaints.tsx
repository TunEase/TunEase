import { supabase } from "../../services/supabaseClient";
export const getAllComplaints = async () => {
  try {
    const { data, error } = await supabase.from("complaints").select("");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching Complaints data:", error);
    return [];
  }
};
