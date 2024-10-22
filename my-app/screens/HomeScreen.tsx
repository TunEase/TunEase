import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
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

  const TopServices = [
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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate("CategoryDetails", { category: item.name })}
    >
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

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TunEase</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("BusinessProfileApp")}
        >
          <Icon name="person" size={24} color="#333" />
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

      <FlatList
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.bannerList}
      />

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={styles.sectionTitle}>Top Services</Text>
    </>
  );

  const renderFooter = () => (
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
          name="mail"
          size={20}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.availableText}>See All Services</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={TopServices}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
      />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  bannerContainer: {
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
  },
  bannerImage: {
    width: "100%",
    height: 100,
  },
  bannerTextContainer: {
    padding: 10,
  },
  bannerText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: "#00796B",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  bannerList: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 55,
  },
  availableButton: {
    flex: 0.48,
    backgroundColor: "#00796B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 8,
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
    marginBottom: 30,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 45,
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
