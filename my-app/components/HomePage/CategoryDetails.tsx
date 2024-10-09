
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const lettresBaladia = ["Letter 1", "Letter 2", "Letter 3", "Letter 4"];

const CategoryDetails: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Letters</Text>
      {category === "Baladia" && (
        <View>
          {lettresBaladia.map((lettre, index) => (
            <Text key={index} style={styles.letterItem}>
              {lettre}
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  letterItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
  },
});
