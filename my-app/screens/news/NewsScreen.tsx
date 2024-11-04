import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import NewsCard from './NewsCard';
import NewsFilters from './NewsFilters';
import { supabase } from '../../services/supabaseClient';
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../components/Form/header';
interface NewsScreenProps {
  navigation: any;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (filter = 'all') => {
    try {
      let query = supabase
        .from('news')
        .select(`
          *,
          business:business_id (
            id,
            name,
            media (
        media_url
      )
          ),
          media (
            media_url,
            is_primary
          ),
          news_tags (
            tag_name
          ),
          news_reactions (
            reaction_type,
            user_id
          ),
          news_comments (
            id,
            content,
            created_at,
            user_id (
              id,
              name,
              media(media_url)
            )
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(activeFilter);
  }, [activeFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(activeFilter);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="News Feed"
        showBackButton={true}
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />

      <NewsFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <FlatList
        data={news}
        renderItem={({ item }) => (
          <NewsCard
            news={item}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNews')}
      >
        <Icon name="post-add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 80, // Add padding for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00796B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});

export default NewsScreen;