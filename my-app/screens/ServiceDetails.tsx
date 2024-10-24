import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import { Service } from "../types/business";
import FAQs from "./FAQs";
import Feedback from "./Feedback";
import Review from "./Review";

const { width } = Dimensions.get("window");

const ServiceDetails: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation();
  const { serviceId } = route.params;
  const [service, setService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = React.useState("About Me");
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchServiceDetails = async () => {
      console.log("Service ID:", serviceId);
      if (!serviceId) {
        console.error("Service ID is undefined");
        return;
      }
      const { data, error } = await supabase
        .from("services")
        .select(
          `
          *,
          media:media(*),
          reviews:reviews(*, media:media(*), user_profile:user_profile(*))
        `
        )
        .eq("id", serviceId)
        .single();

      if (error) {
        console.error("Error fetching service details:", error);
      } else {
        setService(data);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "About Me":
        return (
          <Text style={styles.tabContent}>
            {service?.description || "No description available."}
          </Text>
        );
      case "Feedback":
        return <Feedback />;
      case "Reviews":
        return <Review />;
      case "FAQs":
        return <FAQs />;
      default:
        return null;
    }
  };

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: service.media[Math.floor(Math.random() * service.media.length)]
            .media_url,
        }}
        style={styles.coverImage}
      />
      <View style={styles.profileContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>{`$${service.price}/hr`}</Text>
        <Text style={styles.serviceRating}>
          {`⭐ ${service.reviews[0].rating} (${service.reviews.length} Reviews)`}
        </Text>
      </View>
      <View style={styles.tabContainer}>
        {["About Me", "Feedback", "Reviews", "FAQs"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.complaintButton}
          onPress={() => navigation.navigate("ComplaintsScreen")}
        >
          <Text style={styles.buttonText}>Raise a Complaint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            if (user) {
              // Check if the user is logged in
              navigation.navigate("Book", {
                service: service,
                serviceName: service.name,
              });
            } else {
              navigation.navigate("Login");
            }
          }}
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  coverImage: {
    width: width,
    height: 200,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  servicePrice: {
    fontSize: 16,
    color: "#00796B",
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
  },
  tabContent: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  complaintButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 5,
  },
  bookButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceDetails;
