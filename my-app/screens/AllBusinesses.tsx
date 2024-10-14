import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

interface AllBusinessesProps {
  navigation: NativeStackNavigationProp<any>;
}

const AllBusinesses: React.FC<AllBusinessesProps> = ({ navigation }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBusinesses = async (page: number) => {
      setLoadingMore(true);
      const { data, error } = await supabase
        .from("business")
        .select("*")
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      if (error) {
        console.error("Error fetching businesses:", error);
      } else {
        console.log("Fetched businesses:", data);
        setBusinesses((prev) => [...prev, ...data]);
      }
      setLoading(false);
      setLoadingMore(false);
    };

    fetchBusinesses(page);
  }, [page]);

  const loadMoreBusinesses = () => {
    if (!loadingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && businesses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>All Businesses</Text>
        {businesses.length === 0 ? (
          <Text style={styles.noBusinessesText}>No businesses found.</Text>
        ) : (
          <FlatList
            data={businesses}
            renderItem={({ item }) => (
              <View style={styles.businessCard}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.businessImage}
                />
                <Text style={styles.businessName}>{item.name}</Text>
                <Text style={styles.businessDescription}>
                  {item.description}
                </Text>
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
                    onPress={() =>
                      navigation.navigate("BusinessProfile", {
                        businessId: item.id,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={loadMoreBusinesses}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
              ) : null
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllBusinesses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    padding: 20,
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
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    flex: 1,
    maxWidth: "45%",
    alignItems: "center",
  },
  businessImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  businessDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
  loadingMoreContainer: {
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 16,
    color: "#00796B",
    textAlign: "center",
  },
});
