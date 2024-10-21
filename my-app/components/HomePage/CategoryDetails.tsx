import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const lettresBaladia = ["Madhmoun", "Rokhsa Bine", "Ta3rif bel imdha"];
const lettresBousta = ["chahria", "manda"];
const lettresMarkez = ["bita9t ta3rif", "passport"];
const lettresKbadha = ["tenbri", "tranfert flous"];

const CategoryDetails: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { category } = route.params;

  const getLettres = () => {
    switch (category) {
      case "Baladia":
        return lettresBaladia;
      case "la Poste":
        return lettresBousta;
      case "Markez":
        return lettresMarkez;
      case "Kbadha":
        return lettresKbadha;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <View style={styles.letterList}>
        {getLettres().map((lettre, index) => (
          <Text key={index} style={styles.letterItem}>
            {lettre}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  letterList: {
    marginVertical: 20,
  },
  letterItem: {
    fontSize: 18,
    color: "#1E201E",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
