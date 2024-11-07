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
import Header from "../components/Form/header";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import { Appointment } from "../types/Appointment";
import BookingCard from "./BookingCard";

const AppointmentBookingScreen = ({ route }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { selectedBusiness, service } = route.params || {};

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
  const handleRemoveAppointment = (appointmentId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Appointment Book"
        // backgroundColor="#00796B"
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.calendarText}>View Calendar</Text>
        <Icon name="calendar" size={30} color="#00796B" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
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
                calendarBackground: "#F5F5F5",
                selectedDayBackgroundColor: "#00796B",
                arrowColor: "#00796B",
                todayTextColor: "#00796B",
                dayTextColor: "#333",
                monthTextColor: "#00796B",
                textDayFontWeight: "600",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "600",
              }}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.serviceContainer}>
        <FlatList
          data={showAll ? appointments : appointments.slice(0, 1)}
          renderItem={({ item }) => (
            <View style={styles.bookingCardWrapper}>
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
                icon={
                  <TouchableOpacity
                    onPress={() => handleRemoveAppointment(item.id)}
                  >
                    <Icon name="remove" size={24} color="#800000" />
                  </TouchableOpacity>
                }
              />
              {!showAll && (
                <TouchableOpacity onPress={handleSeeAllPress}>
                  <Text style={styles.seeAllText}>See All Bookings</Text>
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
                  icon={<Icon name="remove" size={24} color="#800000" />}
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
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  serviceContainer: {
    paddingTop: 20,
  },
  calendarButton: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    marginLeft: 20,
    padding: 10,
    borderRadius: 15,
  },
  calendarText: {
    fontSize: 18,
    color: "#00796B",
    marginRight: 150,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalClose: {
    alignSelf: "flex-end",
  },
  bookingCardWrapper: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  seeAllText: {
    textAlign: "center",
    color: "#00796B",
    fontSize: 16,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#00796B",
    fontWeight: "bold",
    marginBottom: 15,
  },
});