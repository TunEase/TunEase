import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Form/header";

const AvailabilityScreen = ({ navigation, route }) => {
  const { service } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { marked: boolean; dotColor: string };
  }>({});

  useEffect(() => {
    if (service) {
      updateServiceDates();
    }
  }, [service]);

  const updateServiceDates = () => {
    if (!service) return;
  
    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
    
    // Only mark dates if both start_date and end_date exist
    if (service.start_date && service.end_date) {
      const start = new Date(service.start_date);
      const end = new Date(service.end_date);
      
      for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
        const dateString = format(day, "yyyy-MM-dd");
        marked[dateString] = { marked: true, dotColor: '#00796B' }; // Green color for service dates
      }
    }
    
    setMarkedDates(marked);
  };

const isDateAvailable = (date: string) => {
  if (!service.start_date || !service.end_date) {
    return false; // If no dates set, no dates are available
  }

  const selectedDay = new Date(date);
  const start = new Date(service.start_date);
  const end = new Date(service.end_date);

    return selectedDay >= start && selectedDay <= end;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Service Availability"
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
      
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: "#00796B",
          },
        }}
        style={styles.calendar}
        theme={{
          todayTextColor: "#00796B",
          selectedDayBackgroundColor: "#00796B",
          selectedDayTextColor: "#ffffff",
          arrowColor: "#00796B",
          monthTextColor: "#00796B",
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
        }}
        minDate={service.start_date || undefined}
        maxDate={service.end_date || undefined}
      />

      <View style={styles.availabilityContainer}>
        <Text style={styles.subtitle}>
          Service Hours for {format(new Date(selectedDate), "MMMM d, yyyy")}:
        </Text>
        
        {isDateAvailable(selectedDate) ? (
          <View style={styles.availabilityItem}>
            <Icon
              name="event-available"
              size={24}
              color="#00796B"
              style={styles.availabilityIcon}
            />
            <View style={styles.availabilityInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.availabilityTime}>
                {format(new Date(`2000-01-01T${service.start_time}`), 'hh:mm a')} - 
                {format(new Date(`2000-01-01T${service.end_time}`), 'hh:mm a')}
              </Text>
              <Text style={styles.durationText}>
                Duration: {service.duration} minutes
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>
            This service is not available on this date.
          </Text>
        )}
      </View>
      <View style={styles.editButtonContainer}>
      <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('AddAvailabilityScreen', { service })}
              >
                <Icon name="edit" size={20} color="#00796B" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  availabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  availabilityTime: {
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 121, 107, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  editButtonText: {
    color: '#00796B',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButtonContainer: {
    marginTop: 7,
    alignItems: 'center',
    fontSize: 16,
  },
});

export default AvailabilityScreen;