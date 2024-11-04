import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Form/header';

const CreateNews = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('active'); // Default status
  const [type, setType] = useState('ANNOUNCEMENT'); // Default type
  const [services, setServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBusinessId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_profile')
          .select('business(id)')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching user business ID:', error);
          Alert.alert('Error', 'Failed to fetch user business ID.');
        } else {
          setBusinessId(data.business[0].id);
          const { data: services, error } = await supabase
            .from('services')
            .select('id, name')
            .eq('business_id', data.business[0].id);

          if (error) throw error;

          setServices(services || []);
        }
      }
    };

    fetchUserBusinessId();
  }, []);

  const handleTagChange = (text) => {
    setTags(text);
    const lastTag = text.split(',').pop().trim();

    if (lastTag.startsWith('@')) {
      const searchTerm = lastTag.slice(1).toLowerCase();
      const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filteredServices);
      setIsSuggestionVisible(filteredServices.length > 0);
    } else {
      setIsSuggestionVisible(false);
    }
  };

  const handleSuggestionSelect = (service) => {
    const currentTags = tags.split(',').map(tag => tag.trim());
    const newTags = currentTags.slice(0, -1).concat(service.name).join(', ') + ', ';
    setTags(newTags);
    setIsSuggestionVisible(false);
    Keyboard.dismiss();
  };

  const handleNext = () => {
    if (!title || !content) {
      Alert.alert('Error', 'Title and content are required.');
      return;
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag); // Filter out empty tags
    const validTags = tagArray.map(tag => {
      const matchedService = services.find(service => service.name.toLowerCase() === tag.toLowerCase());
      return matchedService ? { tag_name: matchedService.name, link: matchedService.id } : null;
    }).filter(tag => tag !== null); // Filter out null values

    if (validTags.length === 0) {
      Alert.alert('Error', 'No valid tags found.');
      return;
    }

    if (!businessId) {
      Alert.alert('Error', 'Business ID is required.');
      return;
    }

    navigation.navigate('MediaScreen', { title, content, tags: validTags, status, type, businessId });
  };

  // Function to render tags as labels
  const renderTags = () => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    return (
      <View style={styles.tagContainer}>
        {tagArray.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => {
              const newTags = tagArray.filter((_, i) => i !== index).join(', ');
              setTags(newTags);
            }}>
              <Icon name="close" size={16} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Create News Post"
        showBackButton={true}
        onBack={() => navigation.goBack()}
        backgroundColor="#00796B"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.description}>Enter the title of your news post.</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.description}>Provide the content of your news post.</Text>
        <TextInput
          style={styles.input}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.description}>Add tags for your news post (comma separated).</Text>
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={handleTagChange}
        />
        {isSuggestionVisible && (
          <FlatList
            data={suggestions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionSelect(item)} style={styles.suggestion}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}
        
        {/* Render tags as labels */}
        {renderTags()}

        <Text style={styles.description}>Select the type of your news post.</Text>
        <View style={styles.typeContainer}>
          {['ANNOUNCEMENT', 'PROMOTION', 'UPDATE', 'EVENT', 'OFFER'].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.typeOption, type === item && styles.selectedType]}
              onPress={() => setType(item)}
            >
              <Text style={styles.typeText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.description}>Select the status of your news post.</Text>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setStatus(status === 'active' ? 'inactive' : 'active')}
          >
            <Icon name={status === 'active' ? "check-box" : "check-box-outline-blank"} size={24} color="#00796B" />
            <Text style={styles.checkboxLabel}> {status === 'active' ? 'Active' : 'Inactive'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },
  button: {
    backgroundColor: '#00796B',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionList: {
    maxHeight: 150,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  suggestion: {
    padding: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  typeOption: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    elevation: 1,
  },
  selectedType: {
    backgroundColor: '#00796B',
  },
  typeText: {
    color: '#333',
    fontSize: 16,
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

export default CreateNews;