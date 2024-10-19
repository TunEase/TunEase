import { supabase } from "../../services/supabaseClient";
export const getAllFees = async () => {
  try {
    const { data, error } = await supabase.from("fees").select("");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching Fees data:", error);
    return [];
  }
};