import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import Header from '../../components/Form/header';
import Icon from 'react-native-vector-icons/FontAwesome';
const ValidationScreen = ({ navigation, route }) => {
  const { title, content, tags, mediaUrls, status, type ,businessId} = route.params;



  const handleSubmit = async () => {
    if (!businessId) {
      Alert.alert('Error', 'Business ID is required.');
      return;
    }

    try {
      // Insert the news post into the database
      const { data, error } = await supabase
        .from('news')
        .insert({
          title,
          content,
          status,
          type,
          business_id: businessId, // Associate with the business ID
        })
        .select('id')
        .single();

      if (error) throw error;

      const newsId = data.id; // Get the newly created news ID

      // Insert media records for all uploaded images
      const mediaPromises = mediaUrls.map(url => 
        supabase.from('media').insert({
          media_url: url,
          news_id: newsId,
          media_type: 'image', 
          news_tags: tags,// Assuming all uploaded media are images
        })
      );

      await Promise.all(mediaPromises);

      // Insert tags into the news_tag table
      const tagPromises = tags.map(tag => 
        supabase.from('news_tags').insert({
          news_id: newsId,
          tag_name: tag.tag_name,
          link: tag.link,
        })
      );

      await Promise.all(tagPromises);

      Alert.alert('Success', 'News post created successfully!');
      navigation.navigate('NewsScreen'); // Navigate back to the news screen
    } catch (error) {
      console.error('Error creating news post:', error);
      Alert.alert('Error', 'Failed to create news post.');
    }
  };


  return (
    <View style={styles.container}>
      <Header
        title="Confirm Your Post"
        showBackButton={true}
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Title:</Text>
        <Text style={styles.content}>{title}</Text>
        <Text style={styles.title}>Content:</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.title}>Tags:</Text>
        {/* Render tags as labels */}
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag.tag_name}</Text>
              <TouchableOpacity onPress={() => {
                const newTags = tags.filter((_, i) => i !== index);
                // Update the tags state (if you have a state for tags)
              }}>
                <Icon name="close" size={16} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.title}>Media:</Text>
        {mediaUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.image} />
        ))}
        <Text style={styles.title}>Status:</Text>
        <Text style={styles.content}>{status}</Text>
        <Text style={styles.title}>Type:</Text>
        <Text style={styles.content}>{type}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 18,
  },
  content: {
    marginBottom: 8,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    padding: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#00796B',
    marginRight: 5,
  },
});

export default ValidationScreen;