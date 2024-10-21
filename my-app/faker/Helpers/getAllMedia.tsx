import { supabase } from "../../services/supabaseClient";
export const getAllMedia = async () => {
  const { data, error } = await supabase.from("media").select("*");
  if (error){
    console.error("Error fetching Media data:", error);
    return [];
  }
  return data;
};
