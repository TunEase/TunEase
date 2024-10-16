import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Footer from "../components/HomePage/MainFooter";

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { icon: "mail", name: "Baldia" },
    { icon: "money", name: "Bousta" },
    { icon: "local-hospital", name: "Hospital" },
    { icon: "medical-services", name: "Medicine" },
  ];

  const TopServices = [
    {
      id: "1",
      name: "Service 1",
      specialty: "Specialty 1",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ0NzF8MHwxfHNlYXJjaHw1fHxjdXN0bWVyJTIwc2VydmljZXMlMjBvZmZpY2VzJTIwcHJpdmF0ZSUyMGNvbXBhbnklMjBhZ2VuY2llc3xlbnwwfHx8fDE3MjkwMjcwMjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "2",
      name: "Service 2",
      specialty: "Specialty 2",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1621773734563-63e6004ed6a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ0NzF8MHwxfHNlYXJjaHwyfHxjdXN0bWVyJTIwc2VydmljZXMlMjBvZmZpY2VzJTIwcHJpdmF0ZSUyMGNvbXBhbnklMjBhZ2VuY2llc3xlbnwwfHx8fDE3MjkwMjcwMjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Icon name={item.icon} size={25} color="#00796B" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.specialty}>{item.specialty}</Text>
      <View style={styles.ratingContainer}>
        <Icon name="star" size={18} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TunEase</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BusinessProfileApp")}
          >
            <Icon name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={24}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search .."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          <FlatList
            data={TopServices}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.availableButton}
            onPress={() => navigation.navigate("AllBusinesses")}
          >
            <Icon
              name="business"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.availableText}>See All Businesses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.availableButton}
            onPress={() => navigation.navigate("AllService")}
          >
            <Icon
              name="mail"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.availableText}>See All Services</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  availableButton: {
    flex: 0.48,
    backgroundColor: "#00796B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  availableText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    display: "flex",
    // flexDirection: "row",
    justifyContent: "center",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  sectionContainer: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: "100%",
    maxWidth: 160,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  specialty: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
