import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import { Service } from "../types/business";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PagerView from "react-native-pager-view";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  ServiceDetails: { serviceId: string };
  Book: { serviceId: string };
  ComplaintsScreen: undefined;
  FAQsScreen: undefined;
  EligibilityScreen: undefined;
  FeesScreen: undefined;
};

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
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blinkAnim] = useState(new Animated.Value(1)); // Initial opacity value

  useEffect(() => {
    const fetchServiceDetails = async () => {
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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const availabilityColor = service.disable_availability ? "red" : "green";

  const renderLabel = (label: string, isEnabled: boolean) => (
    <View
      style={[styles.label, { backgroundColor: isEnabled ? "green" : "grey" }]}
    >
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );

  const isServiceAvailableToday = () => {
    const today = new Date();
    const startDate = new Date(service.start_date);
    const endDate = new Date(service.end_date);
    const startTime = new Date(`1970-01-01T${service.start_time}`);
    const endTime = new Date(`1970-01-01T${service.end_time}`);
    const currentTime = new Date(
      `1970-01-01T${today.toTimeString().slice(0, 8)}`
    );

    return (
      today >= startDate &&
      today <= endDate &&
      currentTime >= startTime &&
      currentTime <= endTime
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.viewPager}
        initialPage={0}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
      >
        {service.media.map((item, index) => (
          <View key={index} style={styles.page}>
            <Image source={{ uri: item.media_url }} style={styles.coverImage} />
          </View>
        ))}
      </PagerView>
      <View style={styles.dotsContainer}>
        {service.media.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.3 }]}
          />
        ))}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.serviceNameContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Animated.View style={{ opacity: blinkAnim }}>
            <FontAwesome
              name="circle"
              size={16}
              color={availabilityColor}
              style={styles.blinkingIcon}
            />
          </Animated.View>
        </View>
        <View style={styles.labelsContainer}>
          {renderLabel("Cash", service.accept_cash)}
          {renderLabel("Card", service.accept_card)}
          {renderLabel("Online", service.accept_online)}
          {renderLabel("Cheque", service.accept_cheque)}
          {renderLabel(service.service_type, true)}
        </View>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        <Text style={styles.serviceProcessingTime}>
          Processing Time: {service.processing_time}
        </Text>
        <View style={styles.availabilityContainer}>
          <Text style={styles.servicePrice}>{`$${service.price}/hr`}</Text>
        </View>
        <Text style={styles.serviceRating}>
          {`⭐ ${service.reviews[0].rating} (${service.reviews.length} Reviews)`}
        </Text>
        <Text style={styles.serviceAvailability}>
          {isServiceAvailableToday()
            ? `Available today from ${service.start_time} to ${service.end_time}`
            : "Not available today"}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("ComplaintsScreen")}
        >
          <MaterialIcons name="report-problem" size={30} color="#FF5722" />
          <Text style={styles.iconText}>Complaints</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("FAQsScreen")}
        >
          <FontAwesome name="question-circle" size={30} color="#007AFF" />
          <Text style={styles.iconText}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (user) {
              navigation.navigate("Book", { serviceId });
            } else {
              navigation.navigate("Login");
            }
          }}
        >
          <FontAwesome name="calendar" size={30} color="#00796B" />
          <Text style={styles.iconText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("EligibilitityScreen", { serviceId })
          }
        >
          <FontAwesome name="check-circle" size={30} color="#4CAF50" />
          <Text style={styles.iconText}>Eligibility</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("FeesScreen", { serviceId })}
        >
          <FontAwesome name="dollar" size={30} color="#FFC107" />
          <Text style={styles.iconText}>Fees</Text>
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
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: width,
    height: height * 0.4, // Adjust this to take the remaining height
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00796B",
    marginHorizontal: 4,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  serviceNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  blinkingIcon: {
    marginLeft: 5,
  },
  serviceDescription: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
    textAlign: "center",
  },
  serviceProcessingTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  servicePrice: {
    fontSize: 16,
    color: "#00796B",
    marginRight: 10,
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  serviceAvailability: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  label: {
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  labelText: {
    color: "#FFF",
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
});

export default ServiceDetails;
