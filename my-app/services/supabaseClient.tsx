import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { faker } from "@faker-js/faker";
// import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
const expoConfig = Constants.expoConfig;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
  throw new Error("Supabase URL or API Key is missing");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);
WebBrowser.maybeCompleteAuthSession();
const EXPO_CLIENT_ID = process.env.EXPO_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.IOS_CLIENT_ID;
export const googleSignUpAction = async () => {
  
  try {
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: EXPO_CLIENT_ID,
      // androidClientId: ANDROID_CLIENT_ID,
      // iosClientId: IOS_CLIENT_ID,
      // You can add more scopes if needed
      scopes: ['profile', 'email'],
    });

    if (response?.type === 'success') {
      const { authentication } = response;
      
      // Sign in to Supabase with the Google token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: authentication?.idToken || '',
      });

      if (error) {
        console.error('Supabase Sign-In Error:', error.message);
        return null;
      }

      console.log('Signed in successfully with Supabase:', data);
      return data;
    } else {
      console.log('Google OAuth flow was cancelled or failed:', response);
      return null;
    }
  } catch (error) {
    console.error('Error during Google sign-up:', error);
    return null;
  }
};
