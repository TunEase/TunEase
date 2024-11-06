import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Form/header';

const AddAvailabilityScreen = ({ navigation, route }) => {
  // const { service } = route.params;
  const service=route.params.service[0];
  console.log('route',route.params);
  
  console.log("servicezz",service);
  // Date states
  const [startDate, setStartDate] = useState(
    service.start_date ? new Date(service.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState(
    service.end_date ? new Date(service.end_date) : new Date()
  );
  
  // Time states
  const [startTime, setStartTime] = useState(
    service.start_time ? new Date(`2000-01-01T${service.start_time}`) : new Date()
  );
  const [endTime, setEndTime] = useState(
    service.end_time ? new Date(`2000-01-01T${service.end_time}`) : new Date()
  );
  
  // Show/Hide picker states
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const onChangeDate = (event, selectedDate, setDate, showSetter) => {
    if (event.type === 'dismissed') {
      showSetter(false);
      return;
    }
    const currentDate = selectedDate || startDate;
    showSetter(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime, setTime, showSetter) => {
    if (event.type === 'dismissed') {
      showSetter(false);
      return;
    }
    const currentTime = selectedTime || startTime;
    showSetter(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSave = async () => {
    try {
      // Validate dates and times
      if (endDate < startDate) {
        Alert.alert('Error', 'End date cannot be before start date');
        return;
      }

      if (endTime < startTime && startDate.getTime() === endDate.getTime()) {
        Alert.alert('Error', 'End time cannot be before start time on the same day');
        return;
      }
console.log("service.id",service.id);

      const { error } = await supabase
        .from('services')
        .update({
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          start_time: format(startTime, 'HH:mm:ss'),
          end_time: format(endTime, 'HH:mm:ss'),
        })
        .eq('id', service.id);

      if (error) throw error;

      Alert.alert('Success', 'Service availability updated successfully', [
        { text: 'OK', onPress: () => navigation.navigate('AvailabilityScreen', { service }) }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Update Service Availability"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Date Range</Text>
        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowStartDate(true)}
        >
          <Icon name="event" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>
            Start Date: {format(startDate, 'MMM dd, yyyy')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowEndDate(true)}
        >
          <Icon name="event" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>
            End Date: {format(endDate, 'MMM dd, yyyy')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Service Hours</Text>
        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowStartTime(true)}
        >
          <Icon name="access-time" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>
            Start Time: {format(startTime, 'hh:mm a')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.dateTimeButton} 
          onPress={() => setShowEndTime(true)}
        >
          <Icon name="access-time" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>
            End Time: {format(endTime, 'hh:mm a')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText} onPress={handleSave}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDate && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => onChangeDate(event, date, setStartDate, setShowStartDate)}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => onChangeDate(event, date, setEndDate, setShowEndDate)}
        />
      )}

      {/* Time Pickers */}
      {showStartTime && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, time) => onChangeTime(event, time, setStartTime, setShowStartTime)}
        />
      )}
      {showEndTime && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, time) => onChangeTime(event, time, setEndTime, setShowEndTime)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 12,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#00796B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddAvailabilityScreen;