import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CreateNewsLoaderProps {
  animationValue: Animated.Value;
}

const CreateNewsLoader: React.FC<CreateNewsLoaderProps> = ({ animationValue }) => {
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
      {/* Header Loader */}
      <View style={styles.headerLoader}>
        <ShimmerEffect />
      </View>

      {/* Title Input Loader */}
      <View style={styles.inputLoader}>
        <ShimmerEffect />
      </View>

      {/* Content Input Loader */}
      <View style={[styles.inputLoader, { height: 120 }]}>
        <ShimmerEffect />
      </View>

      {/* Tags Input Loader */}
      <View style={styles.inputLoader}>
        <ShimmerEffect />
      </View>

      {/* Type Options Loader */}
      <View style={styles.typeContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.typeLoader}>
            <ShimmerEffect />
          </View>
        ))}
      </View>

      {/* Status Checkbox Loader */}
      <View style={styles.checkboxLoader}>
        <ShimmerEffect />
      </View>

      {/* Button Loader */}
      <View style={styles.buttonLoader}>
        <ShimmerEffect />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  headerLoader: {
    height: 56,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputLoader: {
    height: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  typeLoader: {
    width: (SCREEN_WIDTH - 52) / 3,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  checkboxLoader: {
    height: 24,
    width: 120,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonLoader: {
    height: 56,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 'auto',
  },
});

export default CreateNewsLoader;