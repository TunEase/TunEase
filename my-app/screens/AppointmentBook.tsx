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
  const { user } = useAuth();
  const userId = user?.id;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectedBusiness, service } = route.params || {};

  if (!selectedBusiness) {
    return <Text>Loading...</Text>;
  }

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
      if (error) {
        console.error("Error fetching appointments:", error.message);
        return;
      }
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
      (appointment) => appointment.date === day.dateString
    );
    setSelectedDate(day.dateString);
    setSelectedTime(selectedAppointments[0]?.start_time);
  };

  const handleSeeAllPress = () => {
    setShowAll(true);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setShowAll(false);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Appointment Book</Text>
      </View>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.calendarText}>Calendar</Text>
        <Icon name="calendar" size={35} color="#00796B" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setCalendarVisible(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
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
        </View>
      </Modal>

      <View style={styles.serviceContainer}>
        <FlatList
          data={showAll ? appointments : appointments.slice(0, 1)}
          renderItem={({ item }) => (
            <View>
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
              {!showAll && (
                <TouchableOpacity onPress={handleSeeAllPress}>
                  <Text>See All Bookings</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* All Bookings Modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={handleCloseModal}
            >
              <Icon name="close" size={24} color="#00796B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Bookings</Text>
            <FlatList
              style={{ width: "100%" }}
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
  serviceContainer: {
    top: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    // marginTop: 50,
    // top: 50,
  },
  calendarContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    // marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    width: "100%", // Full-width background
    backgroundColor: "#00796B", // Use your desired background color
    paddingVertical: 15, // Adds padding around title for a bolder effect
    alignItems: "center", // Centers the title text
    top: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Set title color to white
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay background
    // top: 50,
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    elevation: 3,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    marginTop: 10,
  },
  bookingItem: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "100%",
  },
  bookingText: {
    fontSize: 16,
    color: "#333",
  },
  modalClose: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  calendarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796B",
    marginRight: 85,
    marginTop: 5,
    marginLeft: 30,
  },
  calendarButton: {
    top: 30,
    right: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});
