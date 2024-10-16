import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const ComplaintsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const categories = {
    "Product Issues": [
      "Defective Item",
      "Wrong Item Delivered",
      "Item Not Received",
    ],
    "Service Complaints": [
      "Poor Customer Service",
      "Delayed Service",
      "Unprofessional Staff",
    ],
    "Billing Problems": ["Overcharged", "Incorrect Invoice", "Refund Issues"],
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setSelectedSubCategory(null);
  };

  const handleSubmit = () => {
    if (selectedCategory && selectedSubCategory) {
      Alert.alert(
        "Report Submitted",
        `Category: ${selectedCategory}\nSubcategory: ${selectedSubCategory}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Report an Issue</Text>
      <View style={styles.complaintsContainer}>
        {Object.keys(categories).map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <TouchableOpacity
              onPress={() => toggleCategory(category)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>
                {category} {selectedCategory === category ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {selectedCategory === category &&
              categories[category].map((sub, subIndex) => (
                <TouchableOpacity
                  key={subIndex}
                  onPress={() => setSelectedSubCategory(sub)}
                  style={styles.subCategoryButton}
                >
                  <Text style={styles.subCategoryText}>{sub}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </View>
      {selectedSubCategory && (
        <Text style={styles.selectedText}>
          Selected: {selectedCategory} - {selectedSubCategory}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !(selectedCategory && selectedSubCategory) &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!(selectedCategory && selectedSubCategory)}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f8",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  complaintsContainer: {
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subCategoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#e9ecef",
  },
  subCategoryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 20,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#c3e6cb",
  },
  submitButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ComplaintsScreen;
