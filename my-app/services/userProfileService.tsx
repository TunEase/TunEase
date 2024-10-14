import { supabase } from './supabaseClient';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  avatarUrl?: string; // Optional field
};

export const fetchUserProfile = async (userId: string):Promise<UserProfile | null> => { 
  const { data, error } = await supabase
      .from('user_profile') // Change to the correct table name
      .select('*')
      .eq('id', userId)
      .single();

  if (error) {
      console.error('Error fetching user profile:', error);
      return null;
  }
  if (!data) {
      console.warn('No user profile found for userId:', userId);
      return null;
  }

  return data as UserProfile;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
  const { error } = await supabase
      .from('user_profile') // Change to the correct table name
      .update(updates)
      .eq('id', userId);

  if (error) {
      console.error('Error updating user profile:', error);
      return false;
  }

  return true;
};