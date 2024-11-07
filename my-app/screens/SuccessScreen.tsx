import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Optional: for animation

interface SuccessScreenProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryNavigateTo: string;
  secondaryNavigateTo: string;
  primaryParams?: object;
  secondaryParams?: object;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryNavigateTo,
  secondaryNavigateTo,
  primaryParams = {},
  secondaryParams = {},
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Optional: Use Lottie animation instead of Icon */}
        {/* <LottieView
          source={require('../assets/animations/success.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        /> */}
        
        <Icon name="check-circle" size={100} color="#00796B" style={styles.icon} />
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate(primaryNavigateTo, primaryParams)}
          >
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate(secondaryNavigateTo, secondaryParams )}
          >
            <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004D40',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 15,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#00796B',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00796B',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;