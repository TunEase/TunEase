import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

export const useBusinessAccess = (navigation: any) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigation.replace('Login');
        return;
      }

      const { data, error } = await supabase
        .from('user_profile')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.role !== 'BUSINESS_MANAGER') {
        Alert.alert('Access Denied', 'Only business managers can access this screen.');
        navigation.goBack();
        return;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking access:', error);
      navigation.goBack();
    }
  }, [navigation]);

  return { userRole, checkAccess };
};