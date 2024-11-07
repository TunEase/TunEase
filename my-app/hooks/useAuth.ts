import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        const sessionUser = data.session?.user || null;
        setUser(sessionUser);
        setRole(sessionUser?.user_metadata?.role || null); // Get role from metadata
      }
      setLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      setRole(session?.user?.user_metadata?.role || null); // Set role on auth state change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear all local storage data
      await AsyncStorage.multiRemove([
        'user',
        'userProfile',
        'authToken',
        'lastLoginTime',
        // Add any other keys you're storing
      ]);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all states
      setUser(null);
      setRole(null);
      setLoading(false);

      // Optional: Clear any other app states or context you might have
      // Example: clearCartItems(), clearUserPreferences(), etc.

      console.log('Logout successful');
      return true;

    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
      
      Alert.alert(
        'Logout Error',
        'There was a problem signing out. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;

    } finally {
      // Ensure loading state is always turned off
      setLoading(false);
    }
  };  

  const checkSessionExpiry = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('Session expired or error:', error);
      await logout();
      return false;
    }
    
    return true;
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      // If you need to validate the current password, you may need additional logic here.
    });

    if (error) {
      console.error("Error updating password:", error);
      throw new Error("Failed to update password");
    }

    return true;
  };
  const updateUserRole = async (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      // You might want to update this in your local storage as well
      // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  //   return { user, role, loading, logout, updatePassword }; // Expose role in return
  // };
  return { user, role, loading, logout, updatePassword, updateUserRole, checkSessionExpiry }; // Expose role in return
};
