// AvailabilityScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabaseClient';
import Availability from '../types/availability';
// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);



const AvailabilityScreen = () => {
  const [availability, setAvailability] = useState<{ [key: string]: { marked: boolean } }>({});
  
  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('date, available');

      if (error) {
        console.error(error);
        return;
      }

      const markedDays: { [key: string]: { marked: boolean } } = {};
      data?.forEach(({ date, available }) => {
        markedDays[date] = { marked: available };
      });

      setAvailability(markedDays);
    };

    fetchAvailability();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Availability</Text>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        markedDates={availability}
        style={styles.calendar}
        theme={{
          todayTextColor: 'orange',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
});

export default AvailabilityScreen;
