import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const signUp = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(user);
  };

  const login = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    setUser(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, signUp, login, logout };
};
