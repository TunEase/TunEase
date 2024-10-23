import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { supabase } from "../services/supabaseClient";

const ManageEligibilityScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId } = route.params;
  const [eligibilities, setEligibilities] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const [eligibilityName, setEligibilityName] = useState("");
  const [eligibilityDescription, setEligibilityDescription] = useState("");

  useEffect(() => {
    fetchEligibilities();
  }, []);

  const fetchEligibilities = async () => {
    const { data, error } = await supabase
      .from("eligibility")
      .select("*")
      .eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching eligibilities:", error);
    } else {
      setEligibilities(data);
    }
  };

  const addEligibility = async () => {
    const { error } = await supabase.from("eligibility").insert([
      {
        name: eligibilityName,
        description: eligibilityDescription,
        service_id: serviceId,
      },
    ]);

    if (error) {
      console.error("Error adding eligibility:", error);
    } else {
      fetchEligibilities();
      setEligibilityName("");
      setEligibilityDescription("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Eligibility</Text>
      <TextInput
        style={styles.input}
        placeholder="Eligibility Name"
        value={eligibilityName}
        onChangeText={setEligibilityName}
      />
      <TextInput
        style={styles.input}
        placeholder="Eligibility Description"
        value={eligibilityDescription}
        onChangeText={setEligibilityDescription}
      />
      <Button title="Add Eligibility" onPress={addEligibility} />
      <FlatList
        data={eligibilities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eligibilityItem}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  eligibilityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ManageEligibilityScreen;
