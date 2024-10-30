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
import { LinearGradient } from "expo-linear-gradient";

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
  const [Error, setError] = useState<string | null>(null);

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
        services:services(*),
        reviews:reviews(rating) 
      `);
      if (error) throw error;
      console.log("Fetched Businesses:", data); // Debugging log
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select(`
          *,
          business:business_id(
            id,
            name
            
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10); // Limite optionnelle pour la performance
  
      if (newsError) throw newsError;
  
      if (newsData) {
        // Deuxième requête pour obtenir les médias
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('*')
          .in('news_id', newsData.map(news => news.id));
  
        if (mediaError) throw mediaError;
  
        // Troisième requête pour obtenir les tags
        const { data: tagData, error: tagError } = await supabase
          .from('news_tag')
          .select('*')
          .in('news_id', newsData.map(news => news.id));
  
        if (tagError) throw tagError;
  
        // Combiner toutes les données
        const newsWithMediaAndTags = newsData.map(news => ({
          ...news,
          media_url: mediaData?.find(media => media.news_id === news.id)?.media_url,
          tags: tagData?.filter(tag => tag.news_id === news.id) || []
        }));
  
        setNews(newsWithMediaAndTags);
        console.log("News fetched successfully:", newsWithMediaAndTags);
      }
    } catch (error) {
      console.error("Error fetching news:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderNewsCards = () => (
    <View style={styles.newsSection}>
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.sectionHeader}>Trending News</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("AllNews")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="arrow-forward" size={20} color="#00796B" />
        </TouchableOpacity>
      </View>

      {/* Main News Card */}
      <TouchableOpacity 
        style={styles.newsCard}
        onPress={() => navigation.navigate("NewsDetail", { newsId: news[0]?.id })}
      >
        <ImageBackground
          source={{ uri: news[0]?.media_url || 'https://via.placeholder.com/300' }}
          style={styles.newsCardImage}
          imageStyle={{ borderRadius: 20 }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.newsGradient}
          >
            <View style={styles.newsCardContent}>
              <View style={styles.tagRow}>
                <View style={styles.tagContainer}>
                  <Icon name="trending-up" size={14} color="#FFF" />
                  <Text style={styles.tagText}>TRENDING</Text>
                </View>
                <View style={styles.navigationContainer}>
                  <TouchableOpacity style={styles.navButton}>
                    <Icon name="chevron-left" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navButton}>
                    <Icon name="chevron-right" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.newsCardTitle} numberOfLines={2}>
                {news[0]?.title}
              </Text>
              <View style={styles.newsCardFooter}>
                <View style={styles.businessInfo}>
                  <Image
                    source={{ uri: news[0]?.business?.logo || 'https://via.placeholder.com/30' }}
                    style={styles.businessLogo}
                  />
                  <Text style={styles.businessName}>{news[0]?.business?.name}</Text>
                </View>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      {/* Secondary News Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.newsScrollView}
      >
        {news.slice(1, 3).map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={[styles.newsCard, styles.newsCardSecondary]}
            onPress={() => navigation.navigate("NewsDetail", { newsId: item.id })}
          >
            <ImageBackground
              source={{ uri: item.media_url || 'https://via.placeholder.com/300' }}
              style={styles.newsCardImage}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.newsGradient}
              >
                <View style={styles.newsCardContent}>
                  <View style={styles.tagRow}>
                    <View style={styles.tagContainer}>
                      <Icon name="fiber-new" size={14} color="#FFF" />
                      <Text style={styles.tagText}>NEW</Text>
                    </View>
                    <View style={styles.navigationContainer}>
                      <TouchableOpacity style={styles.navButton}>
                        <Icon name="chevron-left" size={24} color="#FFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.navButton}>
                        <Icon name="chevron-right" size={24} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.newsCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.newsCardFooter}>
                    <View style={styles.businessInfo}>
                      <Image
                        source={{ uri: item.business?.logo || 'https://via.placeholder.com/30' }}
                        style={styles.businessLogo}
                      />
                      <Text style={styles.businessName}>{item.business?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.readMoreButton}>
                      <Text style={styles.readMoreText}>Read More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require("../assets/background.jpg")}
        style={styles.headerImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.headerTitle}>ASAP</Text>
        <Text style={styles.headerSubtitle}>As Soon As Possible Services</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {/* {Error && <Text style={styles.errorText}>{Error}</Text>}
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={news}
            // renderItem={renderNewsItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        )} */}
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
            // console.log("item  ☢️☢️☢️☢️☢️☢️", item);
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
                  >{`⭐ ${item.reviews?.[0]?.rating || "No reviews"}`}</Text>
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
            {renderNewsCards()}
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
  // Container
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  // Header Styles
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
    top: 36,
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
  headerSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 20,
  },
  profileIcon: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
  },

  // Search Styles
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  // Button Container Styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 15,
  },
  availableButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
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

  // News Section Styles
  newsSection: {
    margin: 15,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#00796B',
    marginRight: 10,
    borderRadius: 2,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewAllText: {
    fontSize: 14,
    color: '#00796B',
    fontWeight: '600',
  },
  newsScrollView: {
    paddingLeft: 15,
  },
  newsCard: {
    width: 300,
    height: 380,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  newsCardImage: {
    width: '100%',
    height: '100%',
  },
  newsGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  newsCardContent: {
    gap: 15,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: '#00796B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFF',
    fontSize: 12,
  },
  newsCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 28,
  },
  newsCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  businessLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  businessName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  readMoreButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readMoreText: {
    color: '#00796B',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Service Card Styles
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
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  serviceReview: {
    fontSize: 14,
    color: "#888",
  },

  // Business Card Styles
  recommendedCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recommendedReview: {
    fontSize: 14,
    color: "#888",
  },
  

  // Utility Styles
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },

});


export default Home;