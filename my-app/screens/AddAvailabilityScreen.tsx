import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Form/header';
interface Service {
  id: string;
  name: string;
}

const AddAvailabilityScreen = ({ navigation, route }) => {
  const { serviceId } = route.params || {};
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [duration, setDuration] = useState(0); // New state for duration
  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    } else {
      fetchAllServices();
    }
  }, [serviceId]);

  const fetchAllServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data);
      if (data.length > 0) {
        setSelectedService(data[0].id);
      }
    }
  };

  const fetchServiceDetails = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) {
      console.error('Error fetching service details:', error);
    } else {
      setSelectedService(data.id);
      setStartDate(new Date(data.start_date));
      setEndDate(new Date(data.end_date));
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
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      duration,
    });
  };


  return (
    <SafeAreaView style={styles.container}>
         <Header 
        title="Update Availability (1/2)"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
      <ScrollView style={styles.content}>
        {/* <View style={styles.pickerContainer}>
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
        </View> */}

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
         <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Duration (minutes):</Text>
          <TextInput
            style={styles.input}
            value={duration.toString()}
            onChangeText={(text) => setDuration(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View> 

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
inputContainer: {
  marginBottom: 16,
},
inputLabel: {
  fontSize: 16,
  marginBottom: 8,
},
input: {
  height: 40,
  borderWidth: 1,
  borderColor: '#00796B',
  borderRadius: 5,
  paddingHorizontal: 10,
},
});

export default AddAvailabilityScreen;