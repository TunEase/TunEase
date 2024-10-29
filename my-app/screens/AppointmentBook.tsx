import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import { Appointment } from "../types/Appointment";
import BookingCard from "./BookingCard";
const AppointmentBookingScreen = ({ route }) => {
  const { user, loading } = useAuth();
  const userId = user?.id;
  // console.log("userId 😁😁", userId);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectedBusiness, service } = route.params || {}; // Extract selectedBusiness from route params

  if (!selectedBusiness) {
    return <Text>Loading...</Text>; // Display loading if selectedBusiness is not available
  }
  // const { service } = route.params || {};
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const someBusinessId = selectedBusiness?.id || "defaultBusinessId"; // Use the passed business ID

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "*,services(name,media(media_url),business(name,media(media_url))),user_profile(name,media(media_url))"
        )
        .eq("client_id", userId);
      console.log("appointments 😁😁", data);
      if (error) {
        console.error("Error fetching appointments:", error.message);
        return;
      }
      //@ts-ignore
      setAppointments(data);
      markAppointmentDates(data);
    }
  };

  const markAppointmentDates = (appointments) => {
    const marked = {};
    appointments.forEach((appointment) => {
      const date = appointment.date;
      marked[date] = { marked: true, dotColor: "#00796B" };
    });
    setMarkedDates(marked);
  };

  const handleDayPress = (day) => {
    const selectedAppointments = appointments.filter(
      //@ts-ignore
      (appointment) => appointment.date === day.dateString
    );
    // Implement display logic for selected appointments
    setSelectedDate(day.dateString);
    //@ts-ignore
    setSelectedTime(selectedAppointments[0].start_time);
  };

  const handleSeeAllPress = () => {
    setShowAll(true);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setShowAll(false);
    setModalVisible(false);
  };
  // const handleProfileCardPress = () => {
  //   console.log("Navigating to StaticBusinessProfile");
  //   navigation.navigate("staticBusinessProfile", {
  //     selectedBusiness,
  //     service,
  //     selectedDate,
  //     selectedTime,
  //   });
  // };
  // console.log("service 😁😁", service);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Book</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#00796B",
          arrowColor: "#00796B",
          todayTextColor: "#00796B",
        }}
      />

      {/* Display Upcoming Appointments */}
      {/* <Text style={styles.subtitle}>Upcoming Appointments</Text> */}
      <FlatList
        data={showAll ? appointments : appointments.slice(0, 1)}
        renderItem={({ item }) => (
          <View style={styles.bookingContainer}>
            <BookingCard
              date={item.date}
              time={item.start_time}
              serviceName={item.services?.name || ""}
              businessName={item.services?.business?.name || ""}
              userName={item.user_profile?.name || ""}
              media={item.services?.media[0]?.media_url || ""}
              mediaBusiness={item.services?.business?.media[0]?.media_url || ""}
            />
            {!showAll && (
              <TouchableOpacity
                onPress={handleSeeAllPress}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See All Bookings</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        //@ts-ignore
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Full-Screen Modal for All Appointments */}
      <Modal
        animationType="slide"
        transparent={true} // Change to true for overlay effect
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {/* New overlay style */}
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={handleCloseModal}
            >
              <Icon name="close" size={24} color="#fff" />
              {/* Change icon color */}
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Bookings</Text>
            <FlatList
              data={appointments}
              renderItem={({ item }) => (
                <BookingCard
                  date={item.date}
                  time={item.start_time}
                  serviceName={item.services?.name || ""}
                  businessName={item.services?.business?.name || ""}
                  userName={item.user_profile?.name || ""}
                  media={item.services?.media[0]?.media_url || ""}
                  mediaBusiness={
                    item.services?.business?.media[0]?.media_url || ""
                  }
                />
              )}
              //@ts-ignore
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppointmentBookingScreen;

const styles = StyleSheet.create({
  seeAllButton: {
    marginBottom: 8,
    alignItems: "center",
  },
  bookingContainer: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f1f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00796B",
    marginVertical: 10,
  },

  seeAllText: {
    fontSize: 16,
    color: "#00796B",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 15,
  },
  profileCardText: {
    fontSize: 18,
    color: "#00796B",
    fontWeight: "bold",
  },
  modalContainer: {
    width: "85%", // Adjust width
    height: "80%",
    backgroundColor: "#f1f1f1",
    borderRadius: 15,
    padding: 25,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  modalClose: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 20,
  },
});
