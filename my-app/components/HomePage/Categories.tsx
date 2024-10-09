import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoriesProps {
  navigation: any;
}

const Categories: React.FC<CategoriesProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.categoriesContainer}>
      <Text style={styles.sectionHeader}>Browse Categories</Text>

      <View style={styles.categoriesScrollable}>
        {[
          { title: "Baladia", icon: "landmark", color: "#FF6F61" },
          { title: "Bousta", icon: "envelope", color: "#6A5ACD" },
          { title: "Markez", icon: "building", color: "#20B2AA" },
          { title: "Baladia", icon: "landmark", color: "#AF6F65" },
        ].map(({ icon, title, color }, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.card, { borderColor: color }]}
            onPress={() =>
              navigation.navigate("CategoryDetails", { category: title })
            }
          >
            <FontAwesome5 name={icon} size={24} color={color} />
            <Text style={[styles.cardText, { color }]}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3572EF",
    marginVertical: 15,
  },
  categoriesContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  categoriesScrollable: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 25,
    margin: 10,
    alignItems: "center",
    width: 120,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D47A1",
    marginTop: 8,
  },
});
