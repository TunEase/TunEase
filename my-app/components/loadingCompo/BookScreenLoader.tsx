import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BookScreenLoaderProps {
  animationValue: Animated.Value;
}

const BookScreenLoader: React.FC<BookScreenLoaderProps> = ({ animationValue }) => {
  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH]
  });

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  const ShimmerEffect = () => (
    <AnimatedLinearGradient
      colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Calendar Loader */}
      <View style={styles.calendarLoader}>
        <ShimmerEffect />
      </View>

      {/* Time Slots Loader */}
      <View style={styles.timeSlotsContainer}>
        <View style={styles.labelLoader}>
          <ShimmerEffect />
        </View>
        <View style={styles.timeSlotsList}>
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.timeSlotLoader}>
              <ShimmerEffect />
            </View>
          ))}
        </View>
      </View>

      {/* Book Now Button Loader */}
      <View style={styles.buttonLoader}>
        <ShimmerEffect />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  calendarLoader: {
    height: 350,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  labelLoader: {
    width: 120,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  timeSlotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlotLoader: {
    width: 80,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonLoader: {
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginTop: 20,
    overflow: 'hidden',
  },
});

export default BookScreenLoader;