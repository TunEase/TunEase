import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    "Technical Issues": [
      "App Crashes",
      "Feature Not Working",
      "Slow Performance",
    ],
    "Delivery Issues": ["Late Delivery", "Damaged Package", "Missing Items"],
    "Account Issues": ["Login Problems", "Account Locked", "Password Reset"],
    "Payment Issues": [
      "Payment Declined",
      "Duplicate Charges",
      "Refund Delays",
    ],
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
      <ScrollView>
        <Text style={styles.header}>Report an Issue</Text>
        <View style={styles.complaintsContainer}>
          {Object.keys(categories).map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                style={styles.categoryButton}
              >
                <View style={styles.categoryTextContainer}>
                  <Text style={styles.categoryText}>{category}</Text>
                  <Text style={styles.arrow}>
                    {selectedCategory === category ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>
              {selectedCategory === category &&
                categories[category].map((sub, subIndex) => (
                  <TouchableOpacity
                    key={subIndex}
                    onPress={() => setSelectedSubCategory(sub)}
                    style={[
                      styles.subCategoryButton,
                      selectedSubCategory === sub && styles.subCategorySelected,
                    ]}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  complaintsContainer: {
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#00796B",
  },
  categoryTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  arrow: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  subCategoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#F0F4F8",
  },
  subCategorySelected: {
    backgroundColor: "#C8E6C9",
  },
  subCategoryText: {
    fontSize: 16,
    color: "#555",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
    marginTop: 20,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#00796B",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  submitButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default ComplaintsScreen;
