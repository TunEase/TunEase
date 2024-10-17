import { supabase } from "../../services/supabaseClient";
export const getAllReviews = async () => {
  try {
    const { data: reviews, error } = await supabase.from("reviews").select("*");

    if (error) throw error;
    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews`, error);
    return [];
  }
};
