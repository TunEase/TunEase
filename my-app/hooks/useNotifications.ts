import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface Notification {
  id: string;  // Changed to uuid to match your schema
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    const setupSubscription = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) return;
  
      const subscription = supabase
        .channel('notifications')
        // ... rest of subscription setup ...
        .subscribe();
  
      return subscription;
    };
  
    fetchNotifications();
    const subscription = setupSubscription();
  
    return () => {
      subscription.then(sub => sub?.unsubscribe());
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(current =>
        current.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(count => Math.max(0, count - 1));
    }
  };

  return { notifications, unreadCount, markAsRead };
};