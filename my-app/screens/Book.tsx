import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import BookScreenLoader from "../components/loadingCompo/BookScreenLoader";
import SuccessScreen from "./SuccessScreen";
import ConfirmationModal from "../components/StatusComponents/ConfirmationModal";
const BookNowScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const selectedBusiness = route?.params?.selectedBusiness || {};

  const { service, serviceName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // State for time picker visibility
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // State for available times
  const [showSuccess, setShowSuccess] = useState(false);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { service } = route.params;
  const serviceId = service.id;
  const { start_date, end_date, duration, start_time, end_time } = service; // Assuming duration is in minutes

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: {
      marked: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
    };
  }>({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

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
      console.error(
        "Error fetching availability:",
        error.message,
        error.details
      );
      return [];
    }

    console.log("Availability:", data);
    return data;
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
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);

    return `${hours.padStart(2, '0')}:${minutes}:00`; // Ensuring "HH:MM:SS"
};
  const calculateAvailableTimes = (availability: any[]) => {
    const availableSlots: string[] = [];
    const serviceDurationInMinutes = duration;
  
    // Convert service start/end times to 24-hour format for calculations
    const serviceStartTime = new Date();
    const serviceEndTime = new Date();
    
    // Parse start_time and end_time (assuming they're in HH:MM format)
    const [startHour, startMinute] = start_time.split(':').map(Number);
    const [endHour, endMinute] = end_time.split(':').map(Number);
    
    serviceStartTime.setHours(startHour, startMinute, 0);
    serviceEndTime.setHours(endHour, endMinute, 0);
  
    // Generate time slots
    for (
      let time = new Date(serviceStartTime);
      time < serviceEndTime;
      time.setMinutes(time.getMinutes() + serviceDurationInMinutes)
    ) {
      // Store times in 12-hour format for display
      availableSlots.push(
        time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        })
      );
    }
  
    // Filter out booked times
    const bookedTimes = availability
      .map((slot) => {
        const start = new Date();
        const end = new Date();
        const [startHour, startMinute] = slot.start_time.split(':').map(Number);
        const [endHour, endMinute] = slot.end_time.split(':').map(Number);
  
        start.setHours(startHour, startMinute, 0);
        end.setHours(endHour, endMinute, 0);
  
        const times = [];
        for (
          let t = new Date(start);
          t < end;
          t.setMinutes(t.getMinutes() + serviceDurationInMinutes)
        ) {
          times.push(
            //@ts-ignore
            t.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            })
          );
        }
        return times;
      })
      .flat();
  
    const finalAvailableTimes = availableSlots.filter(
      //@ts-ignore
      (time :any) => !bookedTimes.includes(time)
    );
  console.log("finalAvailableTimesffffffffffffffffffffff",finalAvailableTimes);
    setAvailableTimes(finalAvailableTimes);
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
            selectedColor: "#00796B",
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


  const handleBookNow = () => {
    console.log("Booking button pressed");
    setConfirmationVisible(true); // Show confirmation modal
  };
  const confirmBooking = async () => {
    setConfirmationVisible(false);
    setLoading(true);
    
    try {
      await createAvailability(selectedDate!, selectedTimeSlot!);
      setShowSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };
  const createAvailability = async (date: string, time: string) => {
    console.log("Input date:", date);
    console.log("Input time:", time);

    // Convert 12-hour time to 24-hour format for database
    const startTime24 = convertTo24HourFormat(time);
    console.log("startTime24ffffffffffffffffffffff",startTime24);
    // Calculate end time
    const [hours, minutes] = startTime24.split(':');
    const endDateTime = new Date();
    endDateTime.setHours(parseInt(hours), parseInt(minutes) + duration);
    const endTime24 = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;

    const hasAppointment = await checkExistingAppointment(userId, date, startTime24);

    if (hasAppointment) {
      return;
    }

    const { data, error } = await supabase.from("availability").insert({
      service_id: serviceId,
      currentdate: date,
      start_time: startTime24, // Use 24-hour format
      start_date: date,
      end_date: date,
      end_time: endTime24, // Use 24-hour format
      duration: duration,
      days_of_week: [],
    });

    if (error) {
      console.error("Error creating availability:", error.message, error.details);
    } else {
      console.log("Availability created:", data);
      await createAppointment(
        serviceId,
        userId,
        date,
        startTime24, // Use 24-hour format
        endTime24, // Use 24-hour format
        "SCHEDULED"
      );
    }
  };
  const checkExistingAppointment = async (
    clientId: string,
    date: string | undefined,
    startTime: string
  ) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("client_id", clientId)
      .eq("date", date)
      .eq("start_time", startTime); // Now using 24-hour format

    if (error) {
      console.error("Error checking existing appointments:", error);
      return false;
    }

    return data.length > 0;
  };
  const createAppointment = async (
    serviceId: string,
    clientId: string,
    date: string,
    startTime: string,
    endTime: string,
    status: string
  ) => {
    const { data, error } = await supabase.from("appointments").insert({
      service_id: serviceId,
      client_id: clientId, // Replace with the actual client ID
      date: date,
      start_time: startTime,
      end_time: endTime,
      status: status,
    });

    if (error) {
      console.error("Error creating appointment:", error);
    } else {
      console.log("Appointment created:", data);
    }
  };
  function convertTo24HourFormat(timeString) {
    // Use a regular expression to extract hours, minutes, and AM/PM parts
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)/i);
  
    if (!match) {
      throw new Error("Invalid time format");
    }
  
    let [_, hours, minutes, period] = match;
  
    // Convert hours and minutes to integers
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
  
    // Convert to 24-hour format
    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }
  
    // Format hours and minutes to always be two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    // Return the result in "HH:MM" 24-hour format
    return `${formattedHours}:${formattedMinutes}`;
  }
  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      const time24Hour = convertTo24HourFormat(time); // Convert to 24-hour format
      console.log("handleTimeSelect",time24Hour);
      console.log("selectedDateffffffffffffffffffffff",selectedDate);
      createAvailability(selectedDate, time24Hour); // Pass 24-hour time
      setSelectedTime(time);
    }
    setSelectedTimeSlot(time);
};
  console.log("business 💀💀", selectedBusiness);

  if (showSuccess) {
    return (
      <SuccessScreen
        title="Booking Confirmed!"
        description={`Your appointment has been scheduled for ${selectedDate} at ${selectedTimeSlot}`}
        primaryButtonText="View Appointments"
        secondaryButtonText="Book Another"
        primaryNavigateTo="AppointmentBook"
        secondaryNavigateTo="Home"
        primaryParams={{
          selectedBusiness,
          service,
          selectedDate,
          selectedTime: selectedTimeSlot
        }}
      />
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        {/* <Header
          title="Book Now"
          showBackButton={true}
          onBack={() => navigation.goBack()}
        /> */}
        <Text style={styles.headerText}>{serviceName}</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: "#00796B",
            arrowColor: "#00796B",
            todayTextColor: "#00796B",
          }}
        />
      </View>

      {availableTimes.length > 0 && (
        <View style={styles.availableTimesContainer}>
          <Text style={styles.label}>Available Times:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContainer}
          >
            {availableTimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTimeSelect(time)}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === time ? styles.selectedTimeSlot : {},
                ]}
              >
                <Text
                  style={{ color: selectedTimeSlot === time ? "#fff" : "#000" }}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Booking Card */}
      {/* <View>
        {selectedDate &&
          selectedTime &&
          service.name &&
          selectedBusiness.name && (
            <BookingCard
              date={selectedDate}
              time={selectedTime}
              serviceName={service.name}
              businessName={selectedBusiness.name}
              userName={user?.name || ""}
            />
          )}
      </View> */}

      <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
          <ConfirmationModal
        visible={confirmationVisible}
        title="Confirm Booking"
        description={`Would you like to book this appointment for ${selectedDate} at ${selectedTimeSlot}?`}
        icon="event"
        onCancel={() => setConfirmationVisible(false)}
        onConfirm={confirmBooking}
        confirmText="Book Now"
        cancelText="Cancel"
        confirmButtonColor="#00796B"
      />

      <ConfirmationModal
        visible={!!error}
        title="Booking Error"
        description={error || ''}
        icon="error"
        onCancel={() => setError(null)}
        onConfirm={() => setError(null)}
        confirmText="OK"
        cancelText="Try Again"
        confirmButtonColor="#D32F2F"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Arrange children in a row
    justifyContent: "space-between", // Space between buttons
    alignItems: "center", // Align items vertically centered
    width: "100%", // Full width of the container
    paddingHorizontal: 20, // Optional: Add padding for spacing
  },
  button: {
    justifyContent: "center", // Center content within the button
    width: "45%", // Adjust width to fit two buttons side by side
    marginTop: 9,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#00796B",
    alignItems: "center",
    elevation: 5,
    display: "flex",
  },
  container: {
    flexGrow: 3,
    padding: 25,
    backgroundColor: "#f1f1f1",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    marginTop: 30,
    marginBottom: 25,
    fontSize: 25,
    fontWeight: "bold",
    color: "#00796B",
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  availableTimesContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
  },
  timeSlot: {
    padding: 10,
    borderRadius: 5,
    borderColor: "#00796B",
    borderWidth: 1,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  selectedTimeSlot: {
    backgroundColor: "#00796B",
    borderColor: "#004D40",
  },
  bookNowButton: {
    backgroundColor: "#00796B",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
    elevation: 5,
  },
});

export default BookNowScreen;
