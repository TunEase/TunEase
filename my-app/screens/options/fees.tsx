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

const FeesScreen: React.FC = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [fees, setFees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFees, setFilteredFees] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      const { data, error } = await supabase
        .from("fees")
        .select("*, media:media(*)")
        .eq("service_id", serviceId);

      if (error) {
        console.error("Error fetching fees:", error);
      } else {
        setFees(data);
        setFilteredFees(data);
      }
    };

    fetchFees();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = fees.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFees(filtered);
    } else {
      setFilteredFees(fees);
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
        title="Fees"
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
          data={filteredFees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.feeCard}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.feeAmount}>{`Fee: $${item.fee}`}</Text>
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
  feeCard: {
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
  feeAmount: {
    fontSize: 16,
    color: "#00796B",
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

export default FeesScreen;
