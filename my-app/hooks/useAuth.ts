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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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

  return { user, role, loading, logout }; // Expose role in return
};
