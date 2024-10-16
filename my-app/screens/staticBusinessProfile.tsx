import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "../types/business";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width, height } = Dimensions.get("window");

type ProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  "staticBusinessProfile"
>;
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "staticBusinessProfile"
>;

const Profile = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {
    coverImageUrl,
    profileImageUrl,
    services = [],
    location,
  } = route.params;

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
    }, 3000);

    return () => clearInterval(interval);
  }, [services]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: coverImageUrl }}
            style={styles.backgroundImage}
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Melissa Peters</Text>
          <Text style={styles.userTitle}>Interior Designer</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#00796B" />
            <Text style={styles.locationText}>Lagos, Nigeria</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>122</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>67</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>37K</Text>
            <Text style={styles.statLabel}>likes</Text>
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
                  onPress={() =>
                    navigation.navigate("ServiceDetails", {
                      serviceId: service.id,
                    })
                  }
                >
                  {service.media.length > 0 && (
                    <Image
                      source={{ uri: service.media[0].media_url }}
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

        {location && location.latitude && location.longitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
        ) : (
          <View
            style={[
              styles.map,
              {
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text>Map not available</Text>
          </View>
        )}
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
  map: {
    width: width,
    height: height * 0.3,
    marginTop: 20,
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
