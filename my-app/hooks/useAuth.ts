import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

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
    await supabase.auth.signOut();
    setUser(null);
    setRole(null); // Clear role on logout
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
  return { user, role, loading, logout, updatePassword, updateUserRole }; // Expose role in return
};
