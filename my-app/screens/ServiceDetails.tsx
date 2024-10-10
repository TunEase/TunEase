import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";

interface ServiceDetailsProps {
  route: RouteProp<
    {
      params: {
        name: string;
        description: string;
      };
    },
    "params"
  >;
  navigation: any; // You can replace 'any' with a more specific type if needed
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  route,
  navigation,
}) => {
  const { name, description } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Feedback")}
        >
          <Text style={styles.headerText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("FAQs")}
        >
          <Text style={styles.headerText}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Review")}
        >
          <Text style={styles.headerText}>Review</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.serviceName}>{name}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerButton: {
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
  },
  contentContainer: {
    paddingTop: 20,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    color: "#666",
  },
});

export default ServiceDetails;
