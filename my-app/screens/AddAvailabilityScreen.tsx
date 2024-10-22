import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Service {
  id: string;
  name: string;
}

const AddAvailabilityScreen = ({ navigation }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

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

  const onChangeDate = (event, selectedDate, setDate, showSetter) => {
    const currentDate = selectedDate || startDate;
    showSetter(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleNext = () => {
    navigation.navigate('AddAvailabilityTimeScreen', {
      selectedService,
      startDate,
      endDate,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Availability (1/2)</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
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
          <Icon name="event" size={20} color="#00796B" style={styles.buttonIcon} />
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
          <Icon name="event" size={20} color="#00796B" style={styles.buttonIcon} />
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

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
},
content: {
  flex: 1,
  padding: 16,
},
pickerContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  marginBottom: 16,
  elevation: 2,
},
picker: {
  height: 50,
},
dateTimeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  padding: 12,
  marginBottom: 16,
  elevation: 2,
},
buttonIcon: {
  marginRight: 10,
},
dateTimeButtonText: {
  fontSize: 16,
  color: '#333',
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginTop: 16,
  marginBottom: 8,
},
daysContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 16,
},
dayButton: {
  padding: 10,
  margin: 4,
  borderWidth: 1,
  borderColor: '#00796B',
  borderRadius: 5,
  width: '13%',
  alignItems: 'center',
},
selectedDay: {
  backgroundColor: '#00796B',
},
dayButtonText: {
  fontSize: 14,
  color: '#00796B',
},
selectedDayText: {
  color: '#FFFFFF',
},
submitButton: {
  backgroundColor: '#00796B',
  padding: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 16,
},
submitButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 18,
},
nextButton: {
  backgroundColor: '#00796B',
  padding: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 16,
},
nextButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 18,
},
});

export default AddAvailabilityScreen;