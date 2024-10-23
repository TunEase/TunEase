import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons"; // Add this line
import { supabase } from "../services/supabaseClient";

const BookNowScreen = ({ route }: { route: any }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // State for time picker visibility
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // State for available times

  const { service } = route.params;
  const serviceId = service.id;
  const { start_date, end_date, duration, start_time, end_time } = service; // Assuming duration is in minutes

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("8:00 AM");
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: {
      marked: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
    };
  }>({});

  useEffect(() => {
    getAvailableDates(start_date, end_date);
  }, []);

  const fetchAvailability = async (date: string) => {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("currentdate", date)
      .eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching availability:", error);
      return [];
    }

    return data; // Return the fetched availability data
  };

  const getAvailableDates = (start: string, end: string) => {
    const today = new Date(); // Get current date
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Adjust startDate to today if it's in the past
    if (startDate < today) {
      startDate.setTime(today.getTime()); // Set startDate to today
    }

    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      marked[dateString] = { marked: true, dotColor: "#00796B" }; // Mark available dates
    }

    setMarkedDates(marked); // Set marked dates state
  };

  const calculateAvailableTimes = (availability: any[]) => {
    const availableSlots: string[] = [];
    const serviceDurationInMinutes = duration; // Assuming duration is in minutes

    // Generate time slots based on the service's start and end time
    const startTimeParts = start_time.split(":");
    const endTimeParts = end_time.split(":");

    const serviceStartTime = new Date();
    serviceStartTime.setHours(
      parseInt(startTimeParts[0]),
      parseInt(startTimeParts[1]),
      0
    );

    const serviceEndTime = new Date();
    serviceEndTime.setHours(
      parseInt(endTimeParts[0]),
      parseInt(endTimeParts[1]),
      0
    );

    // Generate time slots
    for (
      let time = serviceStartTime;
      time < serviceEndTime;
      time.setMinutes(time.getMinutes() + serviceDurationInMinutes)
    ) {
      availableSlots.push(
        time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }

    // Filter out unavailable times based on the fetched availability
    const bookedTimes = availability
      .map((slot) => {
        const start = new Date();
        const end = new Date();
        const startTimeParts = slot.start_time.split(":");
        const endTimeParts = slot.end_time.split(":");

        start.setHours(
          parseInt(startTimeParts[0]),
          parseInt(startTimeParts[1]),
          0
        );
        end.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0);

        const times = [];
        for (
          let t = start;
          t < end;
          t.setMinutes(t.getMinutes() + serviceDurationInMinutes)
        ) {
          times.push(
            //@ts-ignore
            t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        }
        return times;
      })
      .flat();

    // Remove booked times from available slots
    const finalAvailableTimes = availableSlots.filter(
      //@ts-ignore
      (time) => !bookedTimes.includes(time)
    );

    setAvailableTimes(finalAvailableTimes); // Set available times state
  };

  const handleDayPress = async (day: { dateString: string }) => {
    if (day.dateString in markedDates) {
      // Check if the date is already selected
      if (selectedDate === day.dateString) {
        // Unmark the date if it's already selected
        const updatedMarkedDates = {
          ...markedDates,
          [day.dateString]: {
            marked: true,
            dotColor: "#00796B", // Keep it marked as available
          },
        };
        setMarkedDates(updatedMarkedDates);
        setSelectedDate(undefined); // Clear selection
        setAvailableTimes([]); // Clear available times
      } else {
        // Mark the new date and unmark the previous one
        const updatedMarkedDates = {
          ...markedDates,
          [selectedDate || ""]: { marked: true, dotColor: "#00796B" }, // Unmark previous date
          [day.dateString]: {
            selected: true,
            marked: true,
            selectedColor: "blue",
          },
        };
        setMarkedDates(updatedMarkedDates);
        setSelectedDate(day.dateString); // Set the new selected date

        // Fetch availability for the selected date
        const availability = await fetchAvailability(day.dateString);
        console.log("Availability for selected date:", availability);
        calculateAvailableTimes(availability); // Calculate available times based on fetched data
      }
    } else {
      console.log("This date is not available");
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || new Date();
    setShowPicker(false); // Hide the time picker after selection
    setSelectedTime(
      currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleBookNow = () => {
    console.log("Booking confirmed for", selectedDate, "at", selectedTime);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Book </Text>

      {/* Calendar for Date Selection */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#00796B",
          arrowColor: "#00796B",
          todayTextColor: "#00796B",
        }}
      />

      {availableTimes.length > 0 && (
        <View style={styles.availableTimesContainer}>
          <Text style={styles.label}>Available Times:</Text>
          <View style={styles.timeSlotsContainer}>
            {availableTimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTime(time)}
                style={styles.timeSlot}
              >
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Time Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Time:</Text>
        <View style={styles.timeRow}>
          <Text>{selectedTime}</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)} // Show the time picker
            style={styles.iconButton}
          >
            <Icon name="access-time" size={24} color="#00796B" />
            {/* Icon for the time picker */}
          </TouchableOpacity>
        </View>
        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Booking confirmed for {selectedDate} at {selectedTime}!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)} // Close modal
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BookNowScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f1f1f1",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00796B",
    marginBottom: 20,
  },
  pickerContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#00796B",
    paddingVertical: 8,
  },
  iconButton: {
    marginLeft: 10,
  },
  bookNowButton: {
    backgroundColor: "#00796B",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  availableTimesContainer: {
    marginVertical: 16,
  },
  timeSlot: {
    backgroundColor: "#00796B",
    borderRadius: 50, // Make it circular
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#fff",
  },

  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
});
