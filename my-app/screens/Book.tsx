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
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
const BookNowScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { user, loading } = useAuth();
  const userId = user?.id;

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const selectedBusiness = route?.params?.selectedBusiness || {};

  const { service, serviceName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // State for time picker visibility
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // State for available times

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
        console.log("Booked Times:", bookedTimes);

        return times;
      })
      .flat();

    // Remove booked times from available slots
    const finalAvailableTimes = availableSlots.filter(
      //@ts-ignore
      (time) => !bookedTimes.includes(time)
    );
    console.log("Final Available Times:", finalAvailableTimes);
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

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || new Date();
    setShowPicker(false); // Hide the time picker after selection
    setSelectedTime(
      currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleBookNow = () => {
    console.log("Booking button pressed");
    setConfirmationVisible(true); // Show confirmation modal
  };
  const confirmBooking = () => {
    console.log("Booking confirmed");
    setConfirmationVisible(false); // Close modal after confirmation
    setModalVisible(true); // Show booking confirmation modal
    navigation.navigate("AppointmentBook", {
      selectedBusiness,
      service,
      selectedDate, // Pass selectedDate
      selectedTime, // Pass selectedTime
    });
  };
  const createAvailability = async (date: string, time: string) => {
    // Log the input values for debugging
    console.log("Input date:", date);
    console.log("Input time:", time);

    // Parse the selected time into hours and minutes
    const timeParts = time.split(":");
    if (timeParts.length !== 2) {
      console.error("Invalid time format:", time);
      return; // Exit if the time format is invalid
    }

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    // Create a Date object for the start time
    const dateParts = date.split("-"); // Assuming date is in "YYYY-MM-DD" format
    const startDateTime = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based index)
      parseInt(dateParts[2]) // Day
    );

    // Set the hours and minutes
    startDateTime.setHours(hours, minutes, 0); // Set the hours and minutes

    // Check if startDateTime is valid
    if (isNaN(startDateTime.getTime())) {
      console.error("Invalid start date:", startDateTime);
      return; // Exit if the date is invalid
    }

    // Calculate end time by adding the service duration in minutes
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration); // Add service duration

    // Check if endDateTime is valid
    if (isNaN(endDateTime.getTime())) {
      console.error("Invalid end date:", endDateTime);
      return; // Exit if the date is invalid
    }

    // Format end time to a string
    const endTime = endDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const hasAppointment = await checkExistingAppointment(userId, date, time); // Replace with actual client ID

    if (hasAppointment) {
      alert("You already have an appointment at this time.");
      return; // Exit if the user already has an appointment
    }
    // Debugging: Log the values before inserting
    console.log("Inserting availability with:", {
      service_id: serviceId,
      currentdate: date,
      start_time: time,
      end_time: endTime,
      start_date: date,
      end_date: date,
      duration: duration,
      days_of_week: [],
    });

    const { data, error } = await supabase.from("availability").insert({
      service_id: serviceId,
      currentdate: date,
      start_time: time,
      start_date: date,
      end_date: date,
      end_time: endTime,
      duration: duration,
      days_of_week: [], // Adjust this if you want to store the days of the week
    });

    if (error) {
      console.error(
        "Error creating availability:",
        error.message,
        error.details
      );
    } else {
      console.log("Availability created:", data);
      await createAppointment(
        serviceId,
        userId,
        date,
        time,
        endTime,
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
      .eq("start_time", startTime);

    if (error) {
      console.error("Error checking existing appointments:", error);
      return false; // Return false if there's an error
    }

    return data.length > 0; // Return true if there are existing appointments
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
  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      createAvailability(selectedDate, time);
      setSelectedTime(time);
    }
    setSelectedTimeSlot(time);
  };
  console.log("business 💀💀", selectedBusiness);

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to book?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={confirmBooking}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setConfirmationVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Booking Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Booking confirmed for {selectedDate} at {selectedTime}!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("AppointmentBook", {
                  selectedBusiness: selectedBusiness,
                  service: service,
                  selectedDate: selectedDate,
                  selectedTime: selectedTime,
                });
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
