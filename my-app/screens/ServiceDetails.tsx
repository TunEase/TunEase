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
  FlatList,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { Service } from "../types/business";
import FAQs from "./FAQs";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Define the navigation parameter list
type RootStackParamList = {
  ServiceDetails: { serviceId: string };
  Book: { serviceId: string };
  ComplaintsScreen: undefined;
};

// Define the navigation and route props
type ServiceDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ServiceDetails"
>;
type ServiceDetailsRouteProp = RouteProp<RootStackParamList, "ServiceDetails">;

const ServiceDetails: React.FC<{ route: ServiceDetailsRouteProp }> = ({
  route,
}) => {
  const navigation = useNavigation<ServiceDetailsNavigationProp>();
  const { serviceId } = route.params;
  const [service, setService] = useState<Service | null>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState("About Me");
  const [currentIndex, setCurrentIndex] = useState(0);

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

    const fetchFees = async () => {
      const { data, error } = await supabase
        .from("fees")
        .select("*")
        .eq("service_id", serviceId);

      if (error) {
        console.error("Error fetching fees:", error);
      } else {
        setFees(data);
      }
    };

    const fetchEligibility = async () => {
      const { data, error } = await supabase
        .from("eligibility")
        .select("*")
        .eq("service_id", serviceId);

      if (error) {
        console.error("Error fetching eligibility:", error);
      } else {
        setEligibility(data);
      }
    };

    fetchServiceDetails();
    fetchFees();
    fetchEligibility();
  }, [serviceId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "About Me":
        return (
          <Text style={styles.tabContent}>
            {service?.description || "No description available."}
          </Text>
        );
      case "Fees":
        return (
          <View style={styles.contentContainer}>
            {fees && fees.length > 0 ? (
              fees.map((fee, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{fee.name}</Text>
                  <Text style={styles.tableCell}>{`$${fee.fee}`}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.tabContent}>
                No fees information available.
              </Text>
            )}
          </View>
        );
      case "Eligibility":
        return (
          <View style={styles.contentContainer}>
            {eligibility && eligibility.length > 0 ? (
              eligibility.map((criteria, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{criteria.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.tabContent}>
                No eligibility information available.
              </Text>
            )}
          </View>
        );
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
      <FlatList
        data={service.media}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.media_url }} style={styles.coverImage} />
        )}
        pagingEnabled
        onScroll={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.pagination}>
        {service.media.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>{`$${service.price}/hr`}</Text>
        <Text style={styles.serviceRating}>
          {`⭐ ${service.reviews[0].rating} (${service.reviews.length} Reviews)`}
        </Text>
      </View>
      <View style={styles.tabContainer}>
        {["About Me", "Fees", "Eligibility", "FAQs"].map((tab) => (
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
          onPress={() => navigation.navigate("Book", { service: service })}
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#007AFF",
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
    minHeight: 400,
  },
  tabContent: {
    fontSize: 16,
    color: "#666",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1, // Added border for better separation
    borderBottomColor: "#E0E0E0",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Ensures cells take equal space
    textAlign: "center", // Centers text within each cell
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
