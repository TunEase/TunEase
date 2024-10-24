import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';



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
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsContent}>{item.content}</Text>
      <Text style={styles.newsDate}>{new Date(item.published_at).toLocaleDateString()}</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>News</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList data={news}
         renderItem={renderNewsItem} 
         keyExtractor={(item) => item.id}
         />
      )}
    </View>
    

  );
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
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
    newsImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    newsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    newsContent: {
        fontSize: 16,
        marginBottom: 10,
    },
    newsDate: {
        fontSize: 14,
        color: '#888',
    },


})


export default News;
