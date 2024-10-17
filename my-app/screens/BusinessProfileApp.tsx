import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthContext } from "../components/AuthContext";
import { supabase } from "../services/supabaseClient";

type Business = {
  id: string;
  name: string;
  description: string;
  address: string;
  business_type: string;
  phone: string;
  email: string;
  website: string;
  established_year: number;
  media: { id: string; media_url: string }[];
};

const BusinessProfileApp: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        if (!user) {
          setError("User is not logged in");
          return;
        }
        const { data, error } = (await supabase
          .from("business")
          .select(
            `*,
          services(*),
          media(*), 
          reviews(
            *,
            user_profile(*)
          )`
          )
          .eq("manager_id", user.id)
          .single()) as { data: Business | null; error: any };

        if (error) {
          setError(error.message);
        } else {
          console.log("Business data:", data);
          setBusiness(data);
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00796B" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No business found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: business.media[0]?.media_url || "default-image-url" }}
          style={styles.profileImage}
        />
        <Text style={styles.header}>{business.name}</Text>
        <Text style={styles.subheader}>{business.business_type}</Text>
      </View>
      <TouchableOpacity style={styles.availableButton}
      onPress={() => navigation.navigate('AddService' as never)}
      >
        <Icon name="mail" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.availableText}>See All Services</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.card, { opacity: animation }]}>
        <Text style={styles.title}>Business Profile</Text>

        <Text style={styles.description}>{business.description}</Text>

        <View style={styles.detailContainer}>
          <Feather name="map-pin" size={24} color="#FFF" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.info}>{business.address}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="phone" size={24} color="#FFF" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.info}>{business.phone}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="mail" size={24} color="#FFF" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>{business.email}</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="globe" size={24} color="#FFF" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Website</Text>
            <Text
              style={[styles.info, styles.link]}
              onPress={() => Linking.openURL(business.website)}
            >
              {business.website}
            </Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <Feather name="calendar" size={24} color="#FFF" />
          <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Established Year</Text>
            <Text style={styles.info}>{business.established_year}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Business Media</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {business.media.map((mediaItem) => (
              <Image
                key={mediaItem.id}
                source={{ uri: mediaItem.media_url }}
                style={styles.mediaImage}
              />
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("BusinessProfile" as never)}
        >
          <Feather name="settings" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default BusinessProfileApp;

const styles = StyleSheet.create({
  buttonIcon: {
    marginRight: 8,
  },
  availableText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  availableButton: {
    flex: 0.48,
    backgroundColor: "#00796B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  link: {
    color: "#FFF",
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA",
    // Using a light gradient for the background
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#00796B", // Darker header
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFF",
    marginBottom: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  subheader: {
    fontSize: 18,
    color: "#E0F7FA",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 5,
  },
  info: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#00796B", // Darker background for details
    borderWidth: 1,
    borderColor: "#004D40",
  },
  detailTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  mediaImage: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#00796B",
  },
  settingsButton: {
    alignSelf: "flex-end",
    backgroundColor: "#004D40",
    padding: 10,
    borderRadius: 30,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
  },
});
