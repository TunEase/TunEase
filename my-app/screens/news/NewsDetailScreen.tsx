import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDistanceToNow } from 'date-fns';


const { width, height } = Dimensions.get('window');

interface NewsDetailScreenProps {
  route: {
    params: {
      newsId: string;
    };
  };
  navigation: any;
}

const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ route, navigation }) => {
  const { newsId } = route.params;
  const [newsDetail, setNewsDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    fetchNewsDetail();
    checkUserReaction();
  }, [newsId]);

  const checkUserReaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: reaction } = await supabase
        .from('news_reactions')
        .select('reaction_type')
        .eq('news_id', newsId)
        .eq('user_id', user.id)
        .single();

      if (reaction) {
        setUserReaction(reaction.reaction_type);
      }
    } catch (error) {
      console.error('Error checking user reaction:', error);
    }
  };

  const fetchNewsDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          business:business_id (
            id,
            name,
            media (media_url),
            description
          ),
          media (media_url),
          news_tags (tag_name),
          news_comments (
            id,
            content,
            created_at,
            user_id (id, name, media(media_url))
          ),
          news_reactions (
            reaction_type,
            user_id
          )
        `)
        .eq('id', newsId)
        .single();

      if (error) throw error;
      
      setNewsDetail(data);
      setComments(data.news_comments || []);
      setUpvotes(data.news_reactions?.filter(r => r.reaction_type === 'upvote').length || 0);
      setDownvotes(data.news_reactions?.filter(r => r.reaction_type === 'downvote').length || 0);
    } catch (error) {
      console.error('Error fetching news details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: 'upvote' | 'downvote') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Login Required', 'Please login to react to posts');
        return;
      }

      const { data: existingReaction, error: checkError } = await supabase
        .from('news_reactions')
        .select('*')
        .eq('news_id', newsId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          const { error: deleteError } = await supabase
            .from('news_reactions')
            .delete()
            .eq('news_id', newsId)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;

          setUserReaction(null);
          if (type === 'upvote') {
            setUpvotes(prev => prev - 1);
          } else {
            setDownvotes(prev => prev - 1);
          }
        } else {
          const { error: updateError } = await supabase
            .from('news_reactions')
            .update({ reaction_type: type })
            .eq('news_id', newsId)
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
        const { error: insertError } = await supabase
          .from('news_reactions')
          .insert({
            news_id: newsId,
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this news: ${newsDetail.title}`,
        url: newsDetail.media?.[0]?.media_url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (!newsDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>News not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={[styles.headerContent, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {newsDetail?.title}
          </Text>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: newsDetail?.media?.[0]?.media_url }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={styles.heroTitle}>{newsDetail.title}</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity 
         style={styles.businessCard}
         onPress={() => {
         if(newsDetail?.business) {
         navigation.navigate('StaticBusinessProfile', { 
         selectedBusiness:newsDetail.business 
      });
    }
  }}
>
  <Image
    source={{ 
      uri: newsDetail.business?.media?.[0]?.media_url || 'https://via.placeholder.com/40'
    }}
    style={styles.businessLogo}
  />
  <View style={styles.businessInfo}>
    <Text style={styles.businessName}>{newsDetail.business?.name}</Text>
    <Text style={styles.timestamp}>
      {formatDistanceToNow(new Date(newsDetail.created_at), { addSuffix: true })}
    </Text>
  </View>
</TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{newsDetail.content}</Text>

          <View style={styles.tagsContainer}>
            {newsDetail.news_tags?.map((tag: any) => (
              <View key={tag.tag_name} style={styles.tag}>
                <Text style={styles.tagText}>{tag.tag_name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.engagementContainer}>
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
              style={styles.engagementButton}
              onPress={() => navigation.navigate('NewsCommentScreen', { newsId })}
            >
              <Icon name="comment" size={24} color="#666" />
              <Text style={styles.engagementText}>
                Comments ({comments.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.engagementButton}
              onPress={handleShare}
            >
              <Icon name="share" size={24} color="#666" />
              <Text style={styles.engagementText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsPreview}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentTitle}>Recent Comments</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('NewsCommentScreen', { newsId })}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {comments.slice(0, 3).map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Image
                source={{ uri: comment.user_id?.media?.[0]?.media_url }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{comment.user_id.name}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00796B',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  heroContainer: {
    height: height * 0.4,
    width: width,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  businessInfo: {
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
    marginTop: 4,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#00796B',
    fontSize: 14,
    fontWeight: '500',
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
  activeReactionText: {
    color: '#00796B',
    fontWeight: '600',
  },
  engagementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  engagementButtonActive: {
    backgroundColor: '#FFE0E9',
    borderRadius: 20,
  },
  engagementText: {
    color: '#666',
    marginLeft: 4,
  },
  commentsPreview: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#00796B',
    fontWeight: '600',
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  commentText: {
    color: '#666',
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default NewsDetailScreen;