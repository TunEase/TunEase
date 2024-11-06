import React, { useRef, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { supabase } from "../services/supabaseClient";
import MainFooter from "../components/HomePage/MainFooter"; // Import MainFooter

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/business";
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
  const { services = [], media = [] } = selectedBusiness || {}; // Default to empty arrays

  const [modalVisible, setModalVisible] = useState(false);

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

  const handleChatConfirmation = async () => {
    setModalVisible(false);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    // Check if a chat room already exists
    const { data: existingRoom, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("business_id", selectedBusiness.id)
      .eq("user_profile_id", user.id) // Replace with actual user profile ID
      .single();

    if (error && error.code !== "PGRST116") {
      Alert.alert("Error", "Failed to check chat room existence.");
      return;
    }

    let conversationId = existingRoom?.id;

    // If no existing room, create a new one
    if (!conversationId) {
      const { data: newRoom, error: createError } = await supabase
        .from("conversations")
        .insert({
          business_id: selectedBusiness.id,
          user_profile_id: user.id, // Replace with actual user profile ID
        })
        .select("id")
        .single();

      if (createError) {
        Alert.alert("Error", "Failed to create chat room.");
        return;
      }

      conversationId = newRoom.id;
    }

    // Navigate to the chat room
    navigation.navigate("ChatRoomScreen", {
      conversationId,
      businessName: selectedBusiness.name,
      authenticatedUserId: user.id,
    });
  };

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
          <TouchableOpacity
            style={styles.messageIcon}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome name="send" size={24} color="#00796B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userTitle}>{selectedBusiness.description}</Text>
        <View style={styles.locationContainer}>
          <Feather name="map-pin" size={16} color="#00796B" />
          <Text style={styles.locationText}>{selectedBusiness.phone}</Text>
          <Text style={styles.locationText}>{selectedBusiness.email}</Text>
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
                      price: service.price || 0,
                    };
                    navigation.navigate("ServiceDetails", {
                      serviceId: service.id,
                      service: serviceData,
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to chat with this business?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChatConfirmation}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MainFooter navigation={navigation} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    marginRight: 10,
  },
  messageIcon: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  userTitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
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
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Profile;
