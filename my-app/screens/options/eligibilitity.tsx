import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Form/header"; // Import the Header component

const { width } = Dimensions.get("window");

const EligibilityScreen: React.FC = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [eligibilities, setEligibilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEligibilities, setFilteredEligibilities] = useState([]);

  useEffect(() => {
    const fetchEligibilities = async () => {
      const { data, error } = await supabase
        .from("eligibility")
        .select("*, media:media(*)")
        .eq("service_id", serviceId);

      if (error) {
        console.error("Error fetching eligibilities:", error);
      } else {
        setEligibilities(data);
        setFilteredEligibilities(data);
      }
    };

    fetchEligibilities();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = eligibilities.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEligibilities(filtered);
    } else {
      setFilteredEligibilities(eligibilities);
    }
  };

  const renderMedia = (media) => {
    return media.map((item, index) => {
      if (item.media_type === "image") {
        return (
          <Image
            key={index}
            source={{ uri: item.media_url }}
            style={styles.mediaImage}
          />
        );
      } else if (item.media_type === "document") {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(item.media_url)}
          >
            <Text style={styles.pdfText}>View PDF</Text>
          </TouchableOpacity>
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Eligibility"
        onBack={() => navigation.goBack()} // Use navigation to go back
        showBackButton={true}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredEligibilities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eligibilityCard}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.mediaContainer}>
                {renderMedia(item.media)}
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  eligibilityCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaImage: {
    width: width / 3 - 10,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  pdfText: {
    color: "#007AFF",
    margin: 5,
  },
});

export default EligibilityScreen;
