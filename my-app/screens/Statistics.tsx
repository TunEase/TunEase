import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabaseClient";

interface StatisticsProps {
  businessId: number;
}

const Statistics: React.FC<StatisticsProps> = ({ businessId }) => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      const { data, error } = await supabase
        .from("business_statistics")
        .select("*")
        .eq("business_id", businessId)
        .single();

      if (error) {
        console.error("Error fetching statistics:", error);
      } else {
        setStatistics(data);
      }
      setLoading(false);
    };

    fetchStatistics();
  }, [businessId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Business Statistics</Text>

        {/* Display business statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Total Appointments:</Text>
          <Text style={styles.text}>{statistics?.total_appointments || 0}</Text>

          <Text style={styles.sectionHeader}>Total Revenue:</Text>
          <Text style={styles.text}>{statistics?.total_revenue || 0} USD</Text>

          <Text style={styles.sectionHeader}>New Clients:</Text>
          <Text style={styles.text}>{statistics?.new_clients || 0}</Text>

          <Text style={styles.sectionHeader}>Returning Clients:</Text>
          <Text style={styles.text}>{statistics?.returning_clients || 0}</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Refresh Statistics</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;

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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
