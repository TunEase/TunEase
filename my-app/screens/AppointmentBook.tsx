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
import { supabase } from "../services/supabaseClient";
import BookingCard from "./BookingCard";

const AppointmentBookingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [appointments, setAppointments] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const someBusinessId = "yourBusinessId";
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*");
    if (error) {
      console.error("Error fetching appointments:", error.message);
      return;
    }
    //@ts-ignore
    setAppointments(data);
    markAppointmentDates(data);
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
          <BookingCard
            //@ts-ignore
            date={item.date}
            //@ts-ignore
            time={item.start_time}
            //@ts-ignore
            serviceName={item.serviceName}
          />
        )}
        //@ts-ignore
        keyExtractor={(item) => item.id.toString()}
      />

      {!showAll && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={handleSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All Bookings</Text>
        </TouchableOpacity>
      )}

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
                  //@ts-ignore
                  date={item.date}
                  //@ts-ignore
                  time={item.start_time}
                  //@ts-ignore
                  serviceName={item.serviceName}
                />
              )}
              //@ts-ignore
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* Profile Service Card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => {
          console.log("Navigating to StaticBusinessProfile");
          navigation.navigate("StaticBusinessProfile", {
            businessId: someBusinessId,
          });
        }}
      >
        <Text style={styles.profileCardText}>View Business Profile</Text>
        <Icon name="user" size={24} color="#00796B" />
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentBookingScreen;

const styles = StyleSheet.create({
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
  seeAllButton: {
    backgroundColor: "#00796B",
    borderRadius: 8,
    padding: 9,
    alignItems: "center",
    marginTop: 9,
    marginBottom: 60,
  },
  seeAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
    width: "90%", // Adjust width
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalClose: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 20,
  },
});
