import React, { useRef, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../types/business";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
const { width } = Dimensions.get("window");

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "selectedBusiness">;
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "selectedBusiness"
>;

const Profile = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { selectedBusiness } = route.params;
  const { services = [], media = [] } = selectedBusiness; // Default to empty arrays

  if (!selectedBusiness) {
    return <Text>Loading...</Text>; // Or handle the error appropriately
  }

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let scrollValue = 0;
    const interval = setInterval(() => {
      if (flatListRef.current) {
        scrollValue += width * 0.7;
        flatListRef.current.scrollToOffset({
          offset: scrollValue,
          animated: true,
        });
        if (scrollValue >= (services.length - 1) * (width * 0.7)) {
          scrollValue = 0;
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                media[Math.floor(Math.random() * media.length)]?.media_url ||
                "default-image-url",
            }}
            style={styles.backgroundImage}
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  media[Math.floor(Math.random() * media.length)]?.media_url ||
                  "default-image-url",
              }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{selectedBusiness.name}</Text>
          <Text style={styles.userTitle}>{selectedBusiness.description}</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#00796B" />
            <Text style={styles.locationText}>{selectedBusiness.phone}</Text>
            <Text style={styles.locationText}>{selectedBusiness.email}</Text>
          </View>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={services}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item: service }) => (
                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() => {
                    const serviceData = {
                      ...service,
                      media: service.media || [],
                      reviews: service.reviews || [],
                      rating: service.rating || 0,
                      total_reviews: service.total_reviews || 0,
                      price: service.price || 0
                    };
                    navigation.navigate("ServiceDetails", {
                      serviceId: service.id,
                      service: serviceData
                    });
                  }}
                >
                  {service.media?.length > 0 ? (
                    <Image
                      source={{
                        uri:
                          service.media[
                            Math.floor(Math.random() * service.media.length)
                          ]?.media_url || "default-image-url",
                      }}
                      style={styles.serviceImage}
                    />
                  ) : (
                    <Image
                      source={{ uri: "default-image-url" }}
                      style={styles.serviceImage}
                    />
                  )}
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noServicesText}>No services available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 250,
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
    alignSelf: "center",
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
  },
  userTitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    color: "#666666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  servicesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    width: width * 0.7,
  },
  serviceImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666666",
  },
  noServicesText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Profile;
