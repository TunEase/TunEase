import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';

interface Service {
  id: string;
  name: string;
}

const AddAvailabilityScreen = ({ navigation }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([false, false, false, false, false, false, false]);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('id, name');
    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data);
    }
  };

  const handleSubmit = async () => {
    const availabilityData = {
      service_id: selectedService,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      start_time: format(startTime, 'HH:mm'),
      end_time: format(endTime, 'HH:mm'),
      days_of_week: daysOfWeek.map((day, index) => day ? index : -1).filter(day => day !== -1),
    };

    const { data, error } = await supabase.from('availability').insert(availabilityData);

    if (error) {
      console.error('Error adding availability:', error);
    } else {
      console.log('Availability added successfully');
      navigation.goBack();
    }
  };

  const onChangeDate = (event, selectedDate, setDate, showSetter) => {
    const currentDate = selectedDate || startDate;
    showSetter(Platform.OS === 'ios');
    setDate(currentDate);
  };

 // ... (imports and component logic remain the same)

return (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>Add Availability</Text>

    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedService}
        onValueChange={(itemValue) => setSelectedService(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a service" value="" />
        {services.map((service) => (
          <Picker.Item key={service.id} label={service.name} value={service.id} />
        ))}
      </Picker>
    </View>

    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartDate(true)}>
      <Text style={styles.dateTimeButtonText}>Start Date: {format(startDate, 'yyyy-MM-dd')}</Text>
    </TouchableOpacity>
    {showStartDate && (
      <DateTimePicker
        value={startDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setStartDate, setShowStartDate)}
      />
    )}

    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndDate(true)}>
      <Text style={styles.dateTimeButtonText}>End Date: {format(endDate, 'yyyy-MM-dd')}</Text>
    </TouchableOpacity>
    {showEndDate && (
      <DateTimePicker
        value={endDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setEndDate, setShowEndDate)}
      />
    )}

    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartTime(true)}>
      <Text style={styles.dateTimeButtonText}>Start Time: {format(startTime, 'HH:mm')}</Text>
    </TouchableOpacity>
    {showStartTime && (
      <DateTimePicker
        value={startTime}
        mode="time"
        display="default"
        onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setStartTime, setShowStartTime)}
      />
    )}

    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndTime(true)}>
      <Text style={styles.dateTimeButtonText}>End Time: {format(endTime, 'HH:mm')}</Text>
    </TouchableOpacity>
    {showEndTime && (
      <DateTimePicker
        value={endTime}
        mode="time"
        display="default"
        onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setEndTime, setShowEndTime)}
      />
    )}

    <Text style={styles.sectionTitle}>Days of Week:</Text>
    <View style={styles.daysContainer}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
        <TouchableOpacity
          key={day}
          style={[styles.dayButton, daysOfWeek[index] && styles.selectedDay]}
          onPress={() => {
            const newDays = [...daysOfWeek];
            newDays[index] = !newDays[index];
            setDaysOfWeek(newDays);
          }}
        >
          <Text style={[styles.dayButtonText, daysOfWeek[index] && styles.selectedDayText]}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitButtonText}>Add Availability</Text>
    </TouchableOpacity>
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
  },
  picker: {
    height: 40,
  },
  dateTimeButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  dateTimeButtonText: {
    fontSize: 14,
    color: '#495057',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    padding: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: '13%',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    fontSize: 12,
  },
  selectedDayText: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddAvailabilityScreen;