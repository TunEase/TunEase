import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from '../../services/supabaseClient';
import { formatDistanceToNow } from 'date-fns';


interface NewsCardProps {
  news: any;
  navigation: any;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, navigation }) => {
  const [upvotes, setUpvotes] = useState(
    news.news_reactions?.filter(r => r.reaction_type === 'upvote').length || 0
  );
  const [downvotes, setDownvotes] = useState(
    news.news_reactions?.filter(r => r.reaction_type === 'downvote').length || 0
  );
  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    checkUserReaction();
  }, []);

  const checkUserReaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: reaction } = await supabase
        .from('news_reactions')
        .select('reaction_type')
        .eq('news_id', news.id)
        .eq('user_id', user.id)
        .single();

      if (reaction) {
        setUserReaction(reaction.reaction_type);
      }
    } catch (error) {
      console.error('Error checking user reaction:', error);
    }
  };

  // Update handleReaction to handle existing reactions better
  const handleReaction = async (type: 'upvote' | 'downvote') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Login Required', 'Please login to react to posts');
        return;
      }
  
      // First check if reaction exists
      const { data: existingReaction, error: checkError } = await supabase
        .from('news_reactions')
        .select('*')
        .eq('news_id', news.id)
        .eq('user_id', user.id)
        .single();
  
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }
  
      // Handle the reaction based on existing state
      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          // Remove reaction if clicking the same type
          const { error: deleteError } = await supabase
            .from('news_reactions')
            .delete()
            .eq('news_id', news.id)
            .eq('user_id', user.id);
  
          if (deleteError) throw deleteError;
  
          setUserReaction(null);
          if (type === 'upvote') {
            setUpvotes(prev => prev - 1);
          } else {
            setDownvotes(prev => prev - 1);
          }
        } else {
          // Update to new reaction type
          const { error: updateError } = await supabase
            .from('news_reactions')
            .update({ reaction_type: type })
            .eq('news_id', news.id)
            .eq('user_id', user.id);
  
          if (updateError) throw updateError;
  
          setUserReaction(type);
          if (type === 'upvote') {
            setUpvotes(prev => prev + 1);
            setDownvotes(prev => prev - 1);
          } else {
            setDownvotes(prev => prev + 1);
            setUpvotes(prev => prev - 1);
          }
        }
      } else {
        // Create new reaction
        const { error: insertError } = await supabase
          .from('news_reactions')
          .insert({
            news_id: news.id,
            user_id: user.id,
            reaction_type: type
          });
  
        if (insertError) throw insertError;
  
        setUserReaction(type);
        if (type === 'upvote') {
          setUpvotes(prev => prev + 1);
        } else {
          setDownvotes(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      Alert.alert('Error', 'Failed to update reaction');
    }
  };

  return (
    <View style={styles.card}>
   <TouchableOpacity
  style={styles.header}
  onPress={() => navigation.navigate('BusinessProfile', { businessId: news.business.id })}
>
  <Image
    source={{ 
      uri: news.business?.media?.[0]?.media_url || 'https://via.placeholder.com/40'
    }}
    style={styles.businessLogo}
  />
  <View style={styles.headerText}>
    <Text style={styles.businessName}>{news.business?.name}</Text>
    <Text style={styles.timestamp}>
      {formatDistanceToNow(new Date(news.created_at), { addSuffix: true })}
    </Text>
  </View>
</TouchableOpacity>

      {news.media?.[0] && (
        <Image
          source={{ uri: news.media[0].media_url }}
          style={styles.newsImage}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {news.content}
        </Text>

        <View style={styles.tags}>
          {news.news_tags?.map((tag: any) => (
            <View key={tag.tag_name} style={styles.tag}>
              <Text style={styles.tagText}>{tag.tag_name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
        <View style={styles.reactions}>
    <TouchableOpacity
      style={[
        styles.reactionButton,
        userReaction === 'upvote' && styles.activeReaction
      ]}
      onPress={() => handleReaction('upvote')}
    >
      <Icon
        name="arrow-upward"
        size={20}
        color={userReaction === 'upvote' ? '#00796B' : '#666'}
      />
      <Text style={[
        styles.reactionCount,
        userReaction === 'upvote' && styles.activeReactionText
      ]}>
        {upvotes}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.reactionButton,
        userReaction === 'downvote' && styles.activeReaction
      ]}
      onPress={() => handleReaction('downvote')}
    >
      <Icon
        name="arrow-downward"
        size={20}
        color={userReaction === 'downvote' ? '#00796B' : '#666'}
      />
      <Text style={[
        styles.reactionCount,
        userReaction === 'downvote' && styles.activeReactionText
      ]}>
        {downvotes}
      </Text>
    </TouchableOpacity>
  </View>

  <TouchableOpacity
  style={styles.commentButton}
  onPress={() => navigation.navigate('NewsCommentScreen', { newsId: news.id })}
>
  <Icon name="comment" size={20} color="#666" />
  <Text style={styles.commentCount}>
    {news.news_comments?.length || 0} Comments
  </Text>
</TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    activeReactionText: {
        color: '#00796B',
        fontWeight: '600',
      },
      
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  businessLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    color: '#00796B',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  reactions: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  activeReaction: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#666',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default NewsCard;