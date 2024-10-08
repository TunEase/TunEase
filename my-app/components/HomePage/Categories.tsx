import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
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
      <Text style={styles.sectionHeader}>Categories</Text>

      <View style={styles.categoriesScrollable}>
        <TouchableOpacity
        style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Baladia" })
          }
        >
          <FontAwesome5 name="city" size={24} color="#3B82F6" />
          <Text  style={styles.cardText}>Baladia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Bousta" })
          }
        >
          <FontAwesome5 name="envelope" size={24} color="#3B82F6" />
          <Text style={styles.cardText}>Bousta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Markez" })
          }
        >
          <MaterialIcons name="local-police" size={24} color="#3B82F6" />
          <Text style={styles.cardText}>Markez</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesScrollable}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Mo3tamdia" })
          }
        >
          <FontAwesome5 name="city" size={24} color="#3B82F6" />
          <Text style={styles.cardText}>Mo3tamdia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Kbadha" })
          }
        >
          <FontAwesome5 name="city" size={24} color="#3B82F6" />
          <Text style={styles.cardText}>Kbadha</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "Mahkma" })
          }
        >
          <FontAwesome5 name="city" size={24} color="#3B82F6" />
          <Text style={styles.cardText}>Mahkma</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <Text style={styles.questionText}>What do you want?</Text>
        <TouchableOpacity style={styles.scrollButton} onPress={() => {}}>
          <FontAwesome5 name="bars" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },

  categoriesContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  categoriesScrollable: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 15,
    margin: 5,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#3B82F6",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B82F6",
    marginRight: 10,
  },
  scrollButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
});
