import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
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
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ route }) => {
  const { name, description } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </SafeAreaView>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
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
