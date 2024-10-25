import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Footer from "../components/HomePage/MainFooter";
import { supabase } from "../services/supabaseClient";

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: 1,
        duration: 20000, // Adjust duration for speed
        useNativeDriver: true,
      })
    );
    scrollAnimation.start();

    return () => scrollAnimation.stop();
  }, [scrollX]);

  useEffect(() => {
    fetchBusinesses();

    fetchPopularServices();
  }, []);
  const fetchPopularServices = async () => {
    try {
      const { data, error } = await supabase.from("services").select(`
        *,
        media:media(service_id, media_url),
        reviews:reviews(rating)
      `);

      if (error) throw error;

      const servicesWithAverageRating = data.map((service) => {
        const ratings = service.reviews.map((review) => review.rating);
        const averageRating = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;
        return { ...service, averageRating };
      });

      // Sort services by average rating and take the top 4
      const sortedServices = servicesWithAverageRating
        .filter((service) => service.averageRating !== null)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 4);

      setPopularServices(sortedServices);
      console.log("Popular Services:", sortedServices);
    } catch (error) {
      console.error("Error fetching popular services:", error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase.from("business").select(`
          *,
          media:media(business_id, media_url)
        `);
      if (error) throw error;
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require("../assets/background.jpg")}
        style={styles.headerImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.headerTitle}>Discover Services</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate("BusinessProfileApp")}
        >
          <Icon name="person" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const categories = [
    { name: "Category 1", icon: "category" },
    { name: "Category 2", icon: "star" },
    { name: "Category 3", icon: "favorite" },
    { name: "Category 4", icon: "build" },
    { name: "Category 5", icon: "face" },
    { name: "Category 6", icon: "pets" },
    // Add more categories as needed
  ];

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      decelerationRate="fast" // Adjust this for smoother scrolling
    >
      {categories.map((item, index) => (
        <TouchableOpacity key={index} style={styles.categoryItem}>
          <ImageBackground
            source={{ uri: "your-background-image-url" }}
            style={styles.categoryBackground}
          >
            <Icon name={item.icon} size={40} color="#FFF" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTopBusinesses = () => {
    const scrollX = useRef(new Animated.Value(0)).current;

    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Top Businesses</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllBusinesses")}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Animated.FlatList
          data={businesses} // Assuming this is your top businesses data
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * 200,
              index * 200,
              (index + 1) * 200,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                style={[styles.recommendedCard, { transform: [{ scale }] }]}
              >
                <Image
                  source={{
                    uri: item.media[0]?.media_url || "default-image-url",
                  }}
                  style={styles.recommendedImage}
                />
                <TouchableOpacity style={styles.heartIcon}>
                  <FontAwesome name="heart" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.recommendedTitle}>{item.name}</Text>
                <Text
                  style={styles.recommendedReview}
                >{`⭐ ${item.rating}`}</Text>
              </Animated.View>
            );
          }}
          snapToInterval={200}
          decelerationRate="fast"
        />
      </View>
    );
  };
  const renderPopularServices = () => (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Popular Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllService")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={popularServices.slice(0, 4)} // Limit to 4 items
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <Image
              source={{ uri: item.media[0]?.media_url || "default-image-url" }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDescription}>{item.description}</Text>
            <Text
              style={styles.serviceReview}
            >{`⭐ ${item.reviews[0]?.rating}`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );

  const renderFooterButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.availableButton}
        onPress={() => navigation.navigate("AllBusinesses")}
      >
        <Text style={styles.availableText}>See All Businesses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.availableButton}
        onPress={() => navigation.navigate("AllService")}
      >
        <Text style={styles.availableText}>See All Services</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            {renderCategories()}
            {renderTopBusinesses()}
            {renderPopularServices()}
          </>
        )}
        data={[]}
        renderItem={null}
        keyExtractor={() => ""}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooterButtons}
      />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    height: 250,
    position: "relative",
  },
  headerImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerTitle: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 15,
  },
  profileIcon: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    marginTop: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  categoryItem: {
    marginRight: 10,
    alignItems: "center",
    width: 80,
    height: 80,
    justifyContent: "center",
  },
  categoryBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Added background color for better visibility
  },
  categoryText: {
    color: "#FFF",
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  recommendedCard: {
    width: 200,
    marginRight: 10,
    position: "relative",
  },
  recommendedImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  recommendedReview: {
    fontSize: 14,
    color: "#888",
  },
  serviceCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    maxWidth: "45%",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  serviceReview: {
    fontSize: 14,
    color: "#888",
  },
  availableButton: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  availableText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  row: { justifyContent: "space-between" },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  viewAllText: {
    fontSize: 16,
    color: "#00796B",
  },
});

export default Home;
