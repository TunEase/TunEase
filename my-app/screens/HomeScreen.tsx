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
import News from "./News";
      

interface HomeProps {
  navigation: any;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);


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
    fetchNews()
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
        const ratings = service.reviews?.map((review) => review.rating) || [];
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
        media:media(business_id, media_url),
        services:services(*)
      `);
      if (error) throw error;
      console.log("Fetched Businesses:", data); // Debugging log
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  }
 
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error.message);
      } finally {
        console.log("Loading news completed.");
      }
    };

    const renderNewsItem = ({ item }) => (
      <View style={styles.newsCard}>
        <Image source={{ uri: item.image_url }} style={styles.newsImage} />
        <View style={styles.textContainer}>
          <Text style={styles.discountText}>25% off</Text>
          <Text style={styles.withCodeText}>WITH CODE</Text>
          <Text style={styles.shopNowButton}>Shop Now</Text>
        </View>
        <Icon name="add-shopping-cart" size={24} color="#007AFF" style={styles.cartIcon} />
      </View>
    );
    
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require("../assets/background.jpg")}
        style={styles.headerImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.headerTitle}>Welcome</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      )}
    </View>

        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate("BusinessProfileApp")}
        >
          <Icon name="person" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    
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
          data={businesses}
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("staticBusinessProfile", {
                      selectedBusiness: item,
                    })
                  }
                >
                  <Image
                    source={{
                      uri: item.media?.[0]?.media_url || "default-image-url",
                    }}
                    style={styles.recommendedImage}
                  />
                  <Text style={styles.recommendedTitle}>{item.name}</Text>
                  <Text
                    style={styles.recommendedReview}
                  >{`⭐ ${item.rating}`}</Text>
                </TouchableOpacity>
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
        data={popularServices.slice(0, 4)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate("ServiceDetails", { serviceId: item.id })
            }
          >
            <Image
              source={{
                uri: item.media?.[0]?.media_url || "default-image-url",
              }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDescription}>{item.description}</Text>
            <Text
              style={styles.serviceReview}
            >{`⭐ ${item.reviews?.[0]?.rating}`}</Text>
          </TouchableOpacity>
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
            {renderFooterButtons()}
            {renderTopBusinesses()}
            {renderPopularServices()}
          </>
        )}
        data={[]}
        renderItem={null}
        keyExtractor={() => ""}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: "#00796B",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  availableText: {
    color: "#00796B",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
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
  newsCard: {
    width: 300,
    marginRight: 10,
    position: "relative",
  },
  newsImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  discountText: {
    fontSize: 20,
    color: "#FFF",
  },
  withCodeText: {
    fontSize: 16,
    color: "#FFF",
  },
  shopNowButton: {
    fontSize: 16,
    color: "#FFF",
  },
  cartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  errorText: {
    color: "red",
    marginLeft: 10,
  },  
});

export default Home;