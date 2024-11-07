import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

interface AppointmentFiltersProps {
  selectedDate: string;
  selectedService: string;
  services: Array<{ id: string; name: string }>;
  showCalendar: boolean;
  onDateSelect: (date: string) => void;
  onServiceSelect: (serviceId: string) => void;
  onCalendarToggle: () => void;
}

const AppointmentFilters = ({
  selectedDate,
  selectedService,
  services,
  showCalendar,
  onDateSelect,
  onServiceSelect,
  onCalendarToggle,
}: AppointmentFiltersProps) => {
  return (
    <>
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={onCalendarToggle}
        >
          <Ionicons name="calendar" size={24} color="#00796B" />
          <Text style={styles.dateButtonText}>
            {format(new Date(selectedDate), 'MMM dd, yyyy')}
          </Text>
        </TouchableOpacity>

        <View style={styles.serviceFilterContainer}>
          <Picker
            selectedValue={selectedService}
            style={styles.picker}
            onValueChange={onServiceSelect}
          >
            <Picker.Item label="All Services" value="all" />
            {services.map((service) => (
              <Picker.Item 
                key={service.id} 
                label={service.name} 
                value={service.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {showCalendar && (
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => onDateSelect(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#00796B' }
              }}
              theme={{
                todayTextColor: '#00796B',
                selectedDayBackgroundColor: '#00796B',
                selectedDayTextColor: '#ffffff',
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
      picker: {
        height: 50,
      },
      dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
      },
      dateButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#00796B',
        fontWeight: '500',
      },
      serviceFilterContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
      },
      filtersContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      calendarOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        elevation: 5,
        justifyContent: 'flex-start',
        paddingTop: 120,
      },
});

export default AppointmentFilters;