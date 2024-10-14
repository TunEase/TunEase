import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { supabase } from "../../services/supabaseClient"; // Adjust the import based on your project structure 


const ServiceProfile: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6); // Number of services to show initially


  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedData, error } = await supabase
        .from("service") 
        .select("*"); 

        
        if (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } else {
        setData(fetchedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const loadMoreServices = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Load 6 more services
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.service_name}</Text> 
            <Text style={styles.itemDescription}>{item.description}</Text> 
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} 
      />
      {visibleCount < data.length && ( // Show Load More button if there are more services
        <TouchableOpacity style={{ backgroundColor: '#00796B', padding: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={loadMoreServices}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Load More</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ServiceProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  loadingText: {
    fontSize: 18,
    color: "#00796B",
    textAlign: "center",
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
});