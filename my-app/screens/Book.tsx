import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const BookNowScreen = ({ route }: { route: any }) => {
  const { serviceId } = route.params;
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [selectedService, setSelectedService] = useState<string>("La Poste");

  const handleBookNow = () => {
    alert(
      `Booking confirmed for ${selectedService} on ${selectedDate} at ${selectedTime}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Book Your Service</Text>

      {/* Calendar for Date Selection */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate || ""]: {
            selected: true,
            marked: true,
            selectedColor: "#00796B",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#00796B",
          arrowColor: "#00796B",
          todayTextColor: "#00796B",
        }}
      />

      {/* Time Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Time:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="10:00 AM" value="10:00 AM" />
            <Picker.Item label="12:00 PM" value="12:00 PM" />
            <Picker.Item label="2:00 PM" value="2:00 PM" />
            <Picker.Item label="4:00 PM" value="4:00 PM" />
          </Picker>
        </View>
      </View>

      {/* Service Type Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Service:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedService}
            onValueChange={(itemValue) => setSelectedService(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="La Poste" value="La Poste" />
            <Picker.Item label="Baladia" value="Baladia" />
            <Picker.Item label="" value="" />
          </Picker>
        </View>
      </View>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default BookNowScreen;

const styles = StyleSheet.create({
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
  pickerWrapper: {
    borderColor: "#00796B",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    color: "#333",
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
});
