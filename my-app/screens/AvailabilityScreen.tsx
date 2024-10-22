import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import Icon from "react-native-vector-icons/MaterialIcons";

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
        marked[dateString] = { marked: true, dotColor: '#00796B' };
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
      <Icon name="event-available" size={24} color="#00796B" style={styles.availabilityIcon} />
      <View style={styles.availabilityInfo}>
        <Text style={styles.serviceName}>{item.service_name}</Text>
        <Text style={styles.availabilityTime}>{item.start_time} - {item.end_time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Availability</Text>
      </View>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: '#00796B' },
        }}
        style={styles.calendar}
        theme={{
          todayTextColor: '#00796B',
          selectedDayBackgroundColor: '#00796B',
          selectedDayTextColor: '#ffffff',
          arrowColor: '#00796B',
          monthTextColor: '#00796B',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
        }}
      />
      <View style={styles.availabilityContainer}>
        <Text style={styles.subtitle}>Availability for {format(new Date(selectedDate), 'MMMM d, yyyy')}:</Text>
        <FlatList
          data={getAvailabilityForDate(selectedDate)}
          renderItem={renderAvailabilityItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No availability set for this date.</Text>}
          contentContainerStyle={styles.availabilityList}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAvailabilityScreen')}>
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Availability</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
  },
  availabilityContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  availabilityList: {
    flexGrow: 1,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  availabilityIcon: {
    marginRight: 16,
  },
  availabilityInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  availabilityTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00796B',
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AvailabilityScreen;