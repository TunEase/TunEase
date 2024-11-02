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
  ActivityIndicator,
  Dimensions,

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AD_CARD_WIDTH = SCREEN_WIDTH - 40; // 20px padding on eac
const Home: React.FC<HomeProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const adScrollRef = useRef<ScrollView>(null);


  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAutoScroll = () => {
      if (news.length > 1 && !isManualScroll) {
        autoScrollTimer.current = setInterval(() => {
          const nextIndex = (currentAdIndex + 1) % news.length;
          adScrollRef.current?.scrollTo({
            x: nextIndex * AD_CARD_WIDTH,
            animated: true
          });
          setCurrentAdIndex(nextIndex);
        }, 5000);
      }
    };
  
    startAutoScroll();
  
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentAdIndex, news.length, isManualScroll]);

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
          business:business_id (
            id,
            name
          ),
          media (
            media_url,
            is_primary
          ),
          news_tags (
            tag_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);
  
      if (newsError) throw newsError;
      setNews(newsData || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };
  const renderTopAdvertisement = () => {
    if (loading) {
      return (
        <View style={styles.adSection}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00796B" />
          </View>
        </View>
      );
    }
  
    if (!news.length) {
      return (
        <View style={styles.adSection}>
          <View style={styles.emptyContainer}>
            <Icon name="info-outline" size={24} color="#666" />
            <Text style={styles.emptyText}>No featured updates available</Text>
          </View>
        </View>
      );
    }
  
    return (
      <View style={styles.adSection}>
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.sectionHeader}>News</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("NewsScreen")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="arrow-forward" size={16} color="#00796B" />
        </TouchableOpacity>
      </View>
  
        <ScrollView
  ref={adScrollRef}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  onScrollBeginDrag={() => {
    setIsManualScroll(true);
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  }}
  onScrollEndDrag={() => {
    setTimeout(() => {
      setIsManualScroll(false);
    }, 1000); // Give user a second before auto-scroll resumes
  }}
  onMomentumScrollEnd={(event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / AD_CARD_WIDTH);
    setCurrentAdIndex(newIndex);
  }}
  style={styles.adScrollView}
  contentContainerStyle={styles.adScrollContent}
  snapToInterval={AD_CARD_WIDTH}
  decelerationRate="fast"
  scrollEventThrottle={16}
>
{news.map((ad, index) => (
    <View 
      key={ad.id} 
      style={[
        styles.adCardContainer,
        { width: AD_CARD_WIDTH }
      ]}
    >
      <TouchableOpacity
        style={styles.adCard}
        onPress={() => navigation.navigate("NewsDetailScreen", { newsId: ad.id })}
      >
                <ImageBackground
                  source={{ 
                    uri: ad.media?.find(m => m.is_primary)?.media_url || 
                         ad.media?.[0]?.media_url || 
                         'https://via.placeholder.com/400'
                  }}
                  style={styles.adImage}
                  imageStyle={{ borderRadius: 20 }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.adGradient}
                  >
                    <View style={styles.adContent}>
                      <View style={styles.tagRow}>
                        <View style={styles.adBadge}>
                          <Icon name="campaign" size={16} color="#FFF" />
                          <Text style={styles.adBadgeText}>{ad.type || 'FEATURED'}</Text>
                        </View>
                        {ad.news_tag?.slice(0, 2).map((tag) => (
                          <View key={tag.tag_name} style={styles.tag}>
                            <Text style={styles.tagText}>{tag.tag_name}</Text>
                          </View>
                        ))}
                      </View>
  
                      <Text style={styles.adTitle} numberOfLines={2}>
                        {ad.title}
                      </Text>
  
                      <Text style={styles.adDescription} numberOfLines={3}>
                        {ad.content}
                      </Text>
  
                      <View style={styles.adFooter}>
                        <View style={styles.businessInfo}>
                          <Text style={styles.businessName}>{ad.business?.name.slice(0, 5)}</Text>
                          <Text style={styles.dateText}>
                            {new Date(ad.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.detailsButton} onPress={() => {
                                  navigation.navigate('NewsDetailScreen', { newsId: ad.id });
                         }}>
                             <Text style={styles.detailsButtonText}>See Details</Text>
   <Icon name="arrow-forward" size={16} color="#FFF" />
</TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };
  
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
      <View style={styles.adSection}>
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.sectionHeader}>Top Businesses</Text>
          
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("AllBusinesses")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="arrow-forward" size={16} color="#00796B" />
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
                    navigation.navigate("Profile", {
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
    <View style={styles.adSection}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAccent} />
            <Text style={styles.sectionHeader}>Popular Services</Text>
          </View>
          <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("AllService")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="arrow-forward" size={16} color="#00796B" />
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
            {renderTopAdvertisement()}
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
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:8,
  },
  headerAccent:{
    width:4,
    height:20,
    backgroundColor:'#00796B',
    borderRadius:2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewAllText: {
    color: '#00796B',
    fontSize: 14,
    fontWeight: '500',
  },
  adScrollView: {
    height: 400,
  },
  adScrollContent: {
    paddingHorizontal: 0, // Remove horizontal padding here
  },
  adCardContainer: {
    paddingHorizontal: 2, // Add padding to container instead
  },
  adSection: {
    marginVertical: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,121,107,0.2)',
  },
  paginationDotActive: {
    backgroundColor: '#00796B',
    width: 24,
  },
  // Add/update these styles
adCard: {
  height: 400,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: '#FFF',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},
  // Container
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  navigationContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },  
  newsCardSecondary:{
    width: 300,
    height: 380,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    },
  navButton:{
    padding: 10,
    backgroundColor: "#00796B",
    borderRadius: 50,
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
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
  // tagRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  tagContainer: {
    backgroundColor: '#00796B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius:20,
    gap:5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  // tagText: {
  //   color: '#FFF',
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },
  // dateText: {
  //   color: '#FFF',
  //   fontSize: 12,
  // },
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

  adImage: {
    width: '100%',
    height: '100%',
  },
  adGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  adContent: {
    gap: 12,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  adBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 32,
  },
  adDescription: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    lineHeight: 24,
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  createUpdateButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createUpdateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  createUpdateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add to your existing styles
loadingContainer: {
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
},
emptyContainer: {
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  borderRadius: 15,
  gap: 8,
},
emptyText: {
  color: '#666',
  fontSize: 16,
},
tagRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
tag: {
  backgroundColor: 'rgba(255,255,255,0.2)',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 20,
},
tagText: {
  color: '#FFF',
  fontSize: 12,
  fontWeight: '600',
},
dateText: {
  color: 'rgba(255,255,255,0.8)',
  fontSize: 12,
},
viewAll:{
  color: '#00796B',
  fontWeight: '600',
}
});


export default Home;