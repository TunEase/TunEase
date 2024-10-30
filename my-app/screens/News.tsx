import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_at: string;
  image_url: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const renderNewsItem = ({ item }: { item: NewsItem }) => (
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


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setNews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    {error && <Text style={styles.errorText}>{error}</Text>}
    {loading ? (
      <Text>Loading...</Text>
    ) : (
    <SafeAreaView style={styles.container}>
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
    />
  </SafeAreaView>
  )}
</SafeAreaView>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  newsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 14,
    color: '#888',
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  newsContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerText: {
    marginRight: 10,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopNow: {
    color: '#007AFF',
  },    
  cartIcon: {
    marginTop: 10,
    marginBottom: 10,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  discountText: {
    position: 'absolute',
    top: 0,
    left: 0,
  },    
  withCodeText: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shopNowButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  

  });

export default News;