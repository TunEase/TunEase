import { supabase } from "./supabaseClient";

export interface BusinessProfile {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
}

export const fetchBusinessProfile = async (
  businessId: string
): Promise<BusinessProfile | null> => {
  const { data, error } = await supabase
    .from("business_profile")
    .select("*")
    .eq("id", businessId)
    .single();

  if (error) {
    console.error("Error fetching business profile:", error);
    return null;
  }
  if (!data) {
    console.warn("No business profile found for businessId:", businessId);
    return null;
  }

  return data as BusinessProfile;
};

export const updateBusinessProfile = async (
  businessId: string,
  updates: Partial<BusinessProfile>
): Promise<boolean> => {
  const { error } = await supabase
    .from("business_profile")
    .update(updates)
    .eq("id", businessId);

  if (error) {
    console.error("Error updating business profile:", error);
    return false;
  }

  return true;
};
