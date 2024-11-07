import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Animated ,TextInput,ScrollView,ActivityIndicator, SafeAreaView} from 'react-native';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

type RootStackParamList = {
  OnBoardingScreen3: {
    businessName: string;
    businessAddress: string;
    businessType: string;
  };
  OnBoardingScreen4: undefined;
  BusinessProfileApp: undefined;
};
const OnBoardingScreen1: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

 
  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Step 1 of 4</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, { width: `${(progress / 4) * 100}%` }]} />
      </View>
    </View>
    
    <View style={styles.contentContainer}>
      <Image
        source={require('../assets/f586f1755f910f55643bbc9f4d04c8d5-removebg-preview.png')}
        style={styles.onboardingImage}
        resizeMode="contain"
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Your Business Profile</Text>
        <Text style={styles.description}>
          Let's start converting your profile into a business profile! Follow the steps and unlock premium features for managing your business.
        </Text>
      </View>
    </View>
    
    <TouchableOpacity 
      style={styles.nextButton} 
      onPress={() => {
        setProgress(1);
        navigation.navigate('OnBoarding2' as never);
      }}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  </LinearGradient>
  );
};
const OnBoardingScreen2: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [progress, setProgress] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (!businessName.trim() || !businessAddress.trim() || !businessType) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    navigation.navigate('OnBoardingScreen3', {
      businessName: businessName.trim(),
      businessAddress: businessAddress.trim(),
      businessType: businessType
    });
    setIsLoading(false);
  };

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 2 of 4</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBar, { width: `${(progress / 4) * 100}%` }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Your Business</Text>
        <Text style={styles.subtitle}>Let's set up your business profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your business name"
            placeholderTextColor="#rgba(255,255,255,0.6)"
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your business address"
            placeholderTextColor="#rgba(255,255,255,0.6)"
            value={businessAddress}
            onChangeText={setBusinessAddress}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                businessType === 'PUBLIC' && styles.selectedType
              ]}
              onPress={() => setBusinessType('PUBLIC')}
            >
              <Text style={styles.typeText}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                businessType === 'PRIVATE' && styles.selectedType
              ]}
              onPress={() => setBusinessType('PRIVATE')}
            >
              <Text style={styles.typeText}>Private</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.nextButton, !businessName.trim() && styles.disabledButton]}
        onPress={handleNext}
        disabled={isLoading || !businessName.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};
const OnBoardingScreen3: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const [progress, setProgress] = useState(2);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  // Get the business data from the previous screen
  const { businessName, businessAddress, businessType } = route.params as any;

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleNext = async () => {
    if (!description.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
  
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('business')
        .insert([
          {
            name: businessName,
            description: description.trim(),
            address: businessAddress,
            business_type: businessType,
            manager_id: user?.id,
            phone: phone.trim(),
            email: email.trim(),
            longitude: parseFloat(longitude) || null,
            latitude: parseFloat(latitude) || null,
            images: images // Add this line
          }
        ])
        .select()
        .single();
  
      if (error) throw error;
  
      console.log('Business created:', data);
      setProgress(3);
      navigation.navigate('OnBoardingScreen4' as never);
    } catch (error) {
      console.error('Error creating business:', error);
      Alert.alert('Error', 'Failed to create business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const pickAndUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
  
      if (!result.canceled && result.assets[0].base64) {
        setUploading(true);
        const base64FileData = result.assets[0].base64;
        const filePath = `business-images/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(filePath, decode(base64FileData), {
            contentType: 'image/jpeg'
          });
  
        if (uploadError) {
          throw uploadError;
        }
  
        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath);
  
        setImages(prev => [...prev, publicUrl]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step 3 of 4</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBar, { width: `${(progress / 4) * 100}%` }]} />
        </View>
      </View>
  
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Additional Business Details</Text>
        <Text style={styles.subtitle}>Help customers learn more about your business</Text>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your business..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Location (Optional)</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Longitude"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Latitude"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />
          </View>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.phonePrefix}>+1</Text>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="(555) 555-5555"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="business@example.com"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
  
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Images</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <Icon name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addImageButton} 
              onPress={pickAndUploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="add-photo-alternate" size={24} color="#FFF" />
                  <Text style={styles.addImageText}>Add Image</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
  
      <TouchableOpacity 
        style={[styles.nextButton, isLoading && styles.disabledButton]} 
        onPress={handleNext}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#004D40" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};


const OnBoardingScreen4: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(3);
  const {user, updateUserRole} = useAuth();
  
  const handleFinishSetup = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profile')
        .update({ role: 'BUSINESS_MANAGER' })
        .eq('id', user.id);

      if (error) throw error;
      await updateUserRole('BUSINESS_MANAGER');
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#00796B', '#004D40']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Final Step</Text>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBar, { width: '100%' }]} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <Image
              source={require('../assets/9682a0ca074c753297533fa3820dd9f1-removebg-preview.png')}
              style={styles.completionImage}
            />
            
            <Text style={styles.title}>Congratulations! 🎉</Text>
            <Text style={styles.description}>
              Your business profile is ready to go! You now have access to all business management features.
            </Text>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>What's Next?</Text>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={24} color="#80CBC4" />
                <Text style={styles.benefitText}>Manage your business profile</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={24} color="#80CBC4" />
                <Text style={styles.benefitText}>Access analytics and insights</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="check-circle" size={24} color="#80CBC4" />
                <Text style={styles.benefitText}>Connect with customers</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.finishButton} 
          onPress={handleFinishSetup}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  textContainer: {
    width: '90%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  // Progress bar styles
  progressContainer: {
    width: '80%',
    marginVertical: 20,
    alignSelf: 'center',
  },
  progressBarBackground: {
    backgroundColor: '#004D40',
    borderRadius: 10,
    height: 10,
  },
  progressBar: {
    backgroundColor: '#80CBC4',
    height: 10,
    borderRadius: 10,
  },
  progressText: {
    color: '#B2DFDB',
    marginBottom: 5,
    textAlign: 'center',
  },

  // Text styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.8,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 30,
    lineHeight: 24,
  },

  // Input styles
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    width: '100%',
    marginBottom: 15,
  },

  // Image styles
  image: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  onboardingImage: {
    width: '100%',
    height: '40%',
    marginVertical: 20,
  },
  completionImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  // Button styles
  nextButton: {
    backgroundColor: '#80CBC4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 20,
    width: '40%',  // Add this to control the width
    alignItems: 'center', // Add this to center the text
    alignSelf: 'center',
},
  finishButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#004D40',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Type selection styles
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  typeText: {
    color: '#fff',
    fontSize: 16,
  },

  // Benefits section styles
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  benefitText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },

  // Example section styles
  exampleContainer: {
    backgroundColor: '#003D33',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#80CBC4',
    marginBottom: 10,
    textAlign: 'center',
  },
  exampleText: {
    fontSize: 18,
    color: '#B2DFDB',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 15,
  },
  phonePrefix: {
    color: '#fff',
    paddingLeft: 15,
    paddingRight: 5,
  },
  phoneInput: {
    flex: 1,
    color: '#fff',
    padding: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  locationInput: {
    flex: 1,
  },
  imageScrollView: {
    flexGrow: 0,
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#004D40',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#FFF',
    marginTop: 4,
    fontSize: 12,
  },
});

export { OnBoardingScreen1,OnBoardingScreen2, OnBoardingScreen3, OnBoardingScreen4 };