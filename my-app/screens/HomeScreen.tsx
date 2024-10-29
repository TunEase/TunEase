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
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    scrollAnimation.start();
    return () => scrollAnimation.stop();
  }, [scrollX]);

  useEffect(() => {
    fetchBusinesses();
    fetchPopularServices();
    fetchNews();
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

      const sortedServices = servicesWithAverageRating
        .filter((service) => service.averageRating !== null)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 4);

      setPopularServices(sortedServices);
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
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      </View>
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate("BusinessProfileApp")}
      >
        <Icon name="person" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
  <View style={styles.newsCardsContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {news.map((newsGroup, groupIndex) => (
      <View key={`group-${groupIndex}`} style={styles.mainNewsCard}>
        {newsGroup.slice(0, 3).map((newsItem, index) => (
          <TouchableOpacity
            key={`news-${newsItem.id}`}
            style={[
              styles.subNewsCard,
              index === 0 && styles.firstSubCard
            ]}
            onPress={() => navigation.navigate('NewsDetail', { newsId: newsItem.id })}
          >
            <Image
              source={{ 
                uri: newsItem.image_url || 'https://via.placeholder.com/150'
              }}
              style={[
                styles.subNewsImage,
                index === 0 && styles.firstSubNewsImage
              ]}
            />
            <View style={[
              styles.subContentContainer,
              index === 0 && styles.firstSubContentContainer
            ]}>
              <Text style={[
                styles.subNewsTitle,
                index === 0 && styles.firstSubNewsTitle
              ]} numberOfLines={2}>
                {newsItem.title}
              </Text>
              <Text style={styles.dateText}>
                {new Date(newsItem.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </ScrollView>
</View>



  const renderTopBusinesses = () => (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Top Businesses</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllBusinesses")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {businesses.map((business) => (
          <TouchableOpacity
            key={business.id}
            style={styles.businessCard}
            onPress={() =>
              navigation.navigate("staticBusinessProfile", {
                selectedBusiness: business,
              })
            }
          >
            <Image
              source={{
                uri: business.media?.[0]?.media_url || "default-image-url",
              }}
              style={styles.businessImage}
            />
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.businessRating}>⭐ {business.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPopularServices = () => (
    <View>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>Popular Services</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllService")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.servicesGrid}>
        {popularServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate("ServiceDetails", { serviceId: service.id })
            }
          >
            <Image
              source={{
                uri: service.media?.[0]?.media_url || "default-image-url",
              }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceRating}>
              ⭐ {service.averageRating.toFixed(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderNews = () => {
    if (!news || news.length === 0) {
      return null;
    }

    

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
            {renderNews()}
          </>
        )}
        data={[]}
        renderItem={null}
        keyExtractor={() => "key"}
      />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  newsCardsContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  profileIcon: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  availableButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  availableText: {
    color: "#00796B",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#00796B",
    fontSize: 14,
  },
  businessCard: {
    width: 200,
    marginLeft: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  businessInfo: {
    padding: 10,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  businessRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  serviceCard: {
    width: "45%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginBottom: 5,
  },
  serviceRating: {
    fontSize: 14,
    color: "#666",
  },
  newsContainer: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  mainNewsCard: {
    width: 330,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  subNewsCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    height: 100,
    flexDirection: 'row',
  },
  firstSubCard: {
    height: 200,
    flexDirection: 'column',
    marginBottom: 15,
  },
  subNewsImage: {
    width: '40%',
    height: '100%',
  },
  firstSubNewsImage: {
    width: '100%',
    height: '60%',
  },
  subContentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  firstSubContentContainer: {
    padding: 12,
  },
  subNewsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  firstSubNewsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
});

export default Home;