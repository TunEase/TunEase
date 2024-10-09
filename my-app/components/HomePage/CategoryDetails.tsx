import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ButtonStyles from "../Form/Button";

const lettresBaladia = ["Madhmoun", "Rokhsa Bine", "Ta3rif bel imdha"];
const lettresBousta = ["chahria", "manda"];
const lettresMarkez = ["bita9t ta3rif", "passport"];
const lettreskbadha = ["tenbri", "tranfert flous"];
const CategoryDetails: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      {category === "Baladia" && (
        <View style={styles.letterList}>
          {lettresBaladia.map((lettre, index) => (
            <Text key={index} style={styles.letterItem}>
              {lettre}
            </Text>
          ))}
        </View>
      )}
      {category === "Bousta" && (
        <View style={styles.letterList}>
          {lettresBousta.map((lettre, index) => (
            <Text key={index} style={styles.letterItem}>
              {lettre}
            </Text>
          ))}
        </View>
      )}
      {category === "Markez" && (
        <View style={styles.letterList}>
          {lettresMarkez.map((lettre, index) => (
            <Text key={index} style={styles.letterItem}>
              {lettre}
            </Text>
          ))}
        </View>
      )}
      {category === "Kbadha" && (
        <View style={styles.letterList}>
          {lettreskbadha.map((lettre, index) => (
            <Text key={index} style={styles.letterItem}>
              {lettre}
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("navigation")}
      >
        <TouchableOpacity style={ButtonStyles.primaryButton}>
          <Text style={styles.backButtonText}>Back to Categories</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D47A1", // Medium blue title text
    marginBottom: 20,
    textAlign: "center",
  },
  letterList: {
    marginVertical: 20,
  },
  letterItem: {
    fontSize: 18,
    color: "#1565C0", // Darker blue for list items
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#42A5F5", // Soft blue back button
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF", // White text for button
    fontSize: 16,
    fontWeight: "600",
  },
});
