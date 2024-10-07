import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return { user: null, error: error.message };
    }
    setUser(data.user);
    setError(null);
    return { user: data.user, error: null };
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return { user: null, error: error.message };
    }
    setUser(data.user);
    setError(null);
    return { user: data.user, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setError(null);
  };

  return { user, error, signUp, login, logout };
};
