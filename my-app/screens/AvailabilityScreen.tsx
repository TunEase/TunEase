import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';

interface Availability {
  id: string;
  service_id: string;
  service_name: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
}

const AvailabilityScreen = ({ navigation }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean; dotColor: string } }>({});

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select(`
        *,
        services:service_id (name)
      `);

    if (error) {
      console.error('Error fetching availabilities:', error);
      return;
    }

    const formattedData = data.map(item => ({
      ...item,
      service_name: item.services.name
    }));

    setAvailabilities(formattedData as Availability[]);
    updateMarkedDates(formattedData as Availability[]);
  };

  const updateMarkedDates = (availabilityData: Availability[]) => {
    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
    availabilityData.forEach((availability) => {
      const start = new Date(availability.start_date);
      const end = new Date(availability.end_date);
      for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
        const dateString = format(day, 'yyyy-MM-dd');
        marked[dateString] = { marked: true, dotColor: 'green' };
      }
    });
    setMarkedDates(marked);
  };

  const getAvailabilityForDate = (date: string) => {
    return availabilities.filter((availability) => {
      const start = new Date(availability.start_date);
      const end = new Date(availability.end_date);
      const current = new Date(date);
      return current >= start && current <= end && availability.days_of_week.includes(current.getDay());
    });
  };

  const renderAvailabilityItem = ({ item }: { item: Availability }) => (
    <View style={styles.availabilityItem}>
      <Text>Service: {item.service_name}</Text>
      <Text>Time: {item.start_time} - {item.end_time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Availability</Text>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { ...markedDates[selectedDate], selected: true },
        }}
        style={styles.calendar}
        theme={{
          todayTextColor: 'orange',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
        }}
      />
      <View style={styles.availabilityContainer}>
        <Text style={styles.subtitle}>Availability for {selectedDate}:</Text>
        <FlatList
          data={getAvailabilityForDate(selectedDate)}
          renderItem={renderAvailabilityItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No availability set for this date.</Text>}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAvailabilityScreen')}>
        <Text style={styles.addButtonText}>Add Availability</Text>
      </TouchableOpacity>
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
  availabilityContainer: {
    flex: 1,
  },
  availabilityItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AvailabilityScreen;