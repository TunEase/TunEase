import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../components/HomePage/Banner";
import Categories from "../components/HomePage/Categories";
import Footer from "../components/HomePage/MainFooter";
import Notification from "../components/HomePage/Notification";

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Categories navigation={navigation} />

        {/* Updated CTA Buttons */}
        <TouchableOpacity style={styles.CTA}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaText}>Book a New Appointment</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Icon name="add" size={25} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.CTA}
          onPress={() => navigation.navigate("AllBusinesses")}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaText}>View All Businesses</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Icon name="business" size={25} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.CTA}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaText}>All Services</Text>
            {/* <TouchableOpacity style={styles.ctaButton}>
              <Icon name="tablet" size={25} color="#FFFFFF" />
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>

        <Notification />
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 10,
    width: "90%",
  },
  CTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
  },
  ctaButton: {
    backgroundColor: "#00796B",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaText: {
    fontSize: 18,
    color: "#00796B",
    fontWeight: "600",
  },
});
