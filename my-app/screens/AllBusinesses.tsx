import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { supabase } from "../services/supabaseClient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface AllBusinessesProps {
  navigation: NativeStackNavigationProp<any>;
}

const AllBusinesses: React.FC<AllBusinessesProps> = ({ navigation }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase.from("business").select("*");
      if (error) {
        console.error("Error fetching businesses:", error);
      } else {
        console.log("Fetched businesses:", data);
        setBusinesses(data);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={businesses}
        renderItem={({ item }) => (
          <View style={styles.businessCard}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.businessImage}
            />
            <Text style={styles.businessName}>{item.name}</Text>
            <Text style={styles.businessDescription}>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("AllServices", {
                    businessId: item.id,
                  })
                }
              >
                <Text style={styles.buttonText}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log("Profile button pressed for:", item.name);
                }}
              >
                <Text style={styles.buttonText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Text style={styles.header}>All Businesses</Text>}
        ListEmptyComponent={
          <Text style={styles.noBusinessesText}>No businesses found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default AllBusinesses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#00796B",
    textAlign: "center",
    marginTop: 20,
  },
  businessCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    maxWidth: "45%",
  },
  businessImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  businessDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },
  noBusinessesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});
