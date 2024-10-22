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
    { icon: "money", name: "la Poste" },
    { icon: "local-hospital", name: "Hospital" },
    { icon: "medical-services", name: "Medicine" },
  ];

  const topServices = [
    {
      id: "1",
      name: "Bousta",
      specialty: "",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ0NzF8MHwxfHNlYXJjaHw1fHxjdXN0bWVyJTIwc2VydmljZXMlMjBvZmZpY2VzJTIwcHJpdmF0ZSUyMGNvbXBhbnklMjBhZ2VuY2llc3xlbnwwfHx8fDE3MjkwMjcwMjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "2",
      name: "Baldia",
      specialty: "",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1621773734563-63e6004ed6a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ0NzF8MHwxfHNlYXJjaHwyfHxjdXN0bWVyJTIwc2VydmljZXMlMjBvZmZpY2VzJTIwcHJpdmF0ZSUyMGNvbXBhbnklMjBhZ2VuY2llc3xlbnwwfHx8fDE3MjkwMjcwMjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
    },
  ];

  const topBusinesses = [
    {
      id: "1",
      name: "Tech Solutions",
      specialty: "Technology",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ0NzF8MHwxfHNlYXJjaHw2fHxidXNpbmVzc3xlbnwwfHx8fDE3MjkwMjcwMjR8MA&ixlib=rb-4.0.3&q=80&w=1080",
    },
    {
      id: "2",
      name: "Creative Agency",
      specialty: "Design",
      rating: 4.5,
      image:
        "https://www.designinc.co.uk/wp-content/uploads/2019/01/Design-is-incorporated.jpg",
    },
  ];

  const banners = [
    {
      id: "1",
      text: "Get a 35% discount on the first video consultation from now",
      image:
        "https://th.bing.com/th/id/OIP.QM2X4k8I2gKttM4ClRsvPwHaEH?rs=1&pid=ImgDetMain",
    },
    {
      id: "2",
      text: "Exclusive offer for new users: Book now and save 20%",
      image:
        "https://i0.wp.com/lapresse.tn/wp-content/uploads/2023/01/la-poste-tunisienne.jpg?resize=740%2C427&ssl=1",
    },
  ];

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

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerText}>{item.text}</Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: "la Poste" })
          }
        >
          <Text style={styles.bannerButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TunEase</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BusinessProfileApp")}
          >
            <Icon name="person" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search */}
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

        {/* Scrollable Banner */}
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.bannerList}
        />

        {/* Categories */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CategoryDetails", { category: name })
          }
        >
          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <Icon name={item.icon} size={25} color="#00796B" />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
              )}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>

        {/* Top Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          <FlatList
            data={topServices}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Top Businesses */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Businesses</Text>
          <FlatList
            data={topBusinesses}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Buttons */}
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
            onPress={() => navigation.navigate("AllServices")}
          >
            <Icon
              name="business"
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#00796B",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    elevation: 2,
    marginHorizontal: 15,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  bannerList: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  bannerContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    width: 280,
  },
  bannerImage: {
    height: 150,
    width: "100%",
  },
  bannerTextContainer: {
    padding: 10,
    justifyContent: "space-between",
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bannerButton: {
    backgroundColor: "#00796B",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  categoriesContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 50,
    display: "flex",
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
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00796B",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  image: {
    height: 100,
    width: "100%",
    borderRadius: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  specialty: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  availableButton: {
    backgroundColor: "#00796B",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  availableText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default Home;
