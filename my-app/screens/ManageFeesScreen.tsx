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

const ManageFeesScreen: React.FC<{ route: any }> = ({ route }) => {
  const { serviceId } = route.params;
  const [fees, setFees] = useState<
    { id: string; name: string; fee: number; description: string }[]
  >([]);
  const [feeName, setFeeName] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeDescription, setFeeDescription] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .eq("service_id", serviceId);

    if (error) {
      console.error("Error fetching fees:", error);
    } else {
      setFees(data);
    }
  };

  const addFee = async () => {
    const { error } = await supabase.from("fees").insert([
      {
        name: feeName,
        fee: parseFloat(feeAmount),
        description: feeDescription,
        service_id: serviceId,
      },
    ]);

    if (error) {
      console.error("Error adding fee:", error);
    } else {
      fetchFees();
      setFeeName("");
      setFeeAmount("");
      setFeeDescription("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Fees</Text>
      <TextInput
        style={styles.input}
        placeholder="Fee Name"
        value={feeName}
        onChangeText={setFeeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Fee Amount"
        value={feeAmount}
        onChangeText={setFeeAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fee Description"
        value={feeDescription}
        onChangeText={setFeeDescription}
      />
      <Button title="Add Fee" onPress={addFee} />
      <FlatList
        data={fees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.feeItem}>
            <Text>{item.name}</Text>
            <Text>{item.fee}</Text>
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
  feeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ManageFeesScreen;
