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

// Fetch user profile
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {  
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

// Update user profile
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

// Update password
export const updatePassword = async (userId: string, newPassword: string): Promise<boolean> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Error updating password:', error);
    return false;
  }

  return true;
};

// Deactivate user account (soft delete)
export const deactivateAccount = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_profile') // Change to the correct table name
    .update({ is_active: false }) // Assuming `is_active` is a field that controls user status
    .eq('id', userId);

  if (error) {
    console.error('Error deactivating account:', error);
    return false;
  }

  return true;
};
