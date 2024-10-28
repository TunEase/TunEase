import React, { useState ,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { format, parse } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddAvailabilityTimeScreen = ({ navigation, route }) => {
  const { selectedService, startDate, endDate, duration } = route.params;
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState([false, false, false, false, false, false, false]);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false); 
  // Convert string dates back to Date objects
  const parsedStartDate = parse(startDate, 'yyyy-MM-dd', new Date());
  const parsedEndDate = parse(endDate, 'yyyy-MM-dd', new Date());

   useEffect(() => {
    fetchExistingAvailability();
  }, [selectedService]);
  


  const fetchExistingAvailability = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('service_id', selectedService)
      .gte('start_date', startDate)
      .lte('end_date', endDate)
      .order('start_date', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching existing availability:', error);
    } else if (data && data.length > 0) {
      const availability = data[0];
      setStartTime(new Date(`2000-01-01T${availability.start_time}`));
      setEndTime(new Date(`2000-01-01T${availability.end_time}`));
      setDaysOfWeek(availability.days_of_week.map(day => day !== -1));
    }
  };


  const onChangeTime = (
    event: Event,
    selectedTime: Date | undefined,
    setTime: React.Dispatch<React.SetStateAction<Date>>,
    showSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const currentTime = selectedTime || startTime;
    showSetter(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSubmit = async () => {
    const availabilityData = {
      service_id: selectedService,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      start_time: format(startTime, 'HH:mm'),
      end_time: format(endTime, 'HH:mm'),
      duration: duration,
      days_of_week: daysOfWeek.map((day, index) => day ? index : -1).filter(day => day !== -1),
    };

    const { data, error } = await supabase
      .from('availability')
      .upsert(availabilityData, { onConflict: 'service_id, start_date, end_date, start_time, end_time' });

    if (error) {
      console.error('Error updating availability:', error);
    } else {
      console.log('Availability updated successfully');
      navigation.navigate('ServiceDetails', { serviceId: selectedService });
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Availability (2/2)</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartTime(true)}>
          <Icon name="access-time" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>Start Time: {format(startTime, 'HH:mm')}</Text>
        </TouchableOpacity>
        {showStartTime && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => onChangeTime(event as unknown as Event, selectedTime, setStartTime, setShowStartTime)}
          />
        )}

        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndTime(true)}>
          <Icon name="access-time" size={20} color="#00796B" style={styles.buttonIcon} />
          <Text style={styles.dateTimeButtonText}>End Time: {format(endTime, 'HH:mm')}</Text>
        </TouchableOpacity>
        {showEndTime && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => onChangeTime(event as unknown as Event, selectedTime, setEndTime, setShowEndTime)}
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previousButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
  <Text style={styles.buttonText}>Submit</Text>
  <Icon name="check" size={20} color="#FFFFFF" style={[styles.buttonIcon, { marginLeft: 8, marginRight: 0 }]} />
</TouchableOpacity>
        </View>
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
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      dayButton: {
        padding: 8,
        margin: 2,
        borderWidth: 1,
        borderColor: '#00796B',
        borderRadius: 4,
        width: '13%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      },
      selectedDay: {
        backgroundColor: '#00796B',
      },
      dayButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#00796B',
      },
      selectedDayText: {
        color: '#FFFFFF',
      },
      submitButton: {
        backgroundColor: '#00796B',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      submitButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
      },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  previousButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },  
  buttonIcon: {
    marginRight: 8,
  },
});

export default AddAvailabilityTimeScreen;