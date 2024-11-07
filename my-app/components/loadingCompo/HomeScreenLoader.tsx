import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AD_CARD_WIDTH = SCREEN_WIDTH - 40;

interface HomeScreenLoaderProps {
  animationValue: Animated.Value;
}

const HomeScreenLoader: React.FC<HomeScreenLoaderProps> = ({ animationValue }) => {
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
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ translateX }] }
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* News Section Loader */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccentLoader} />
        <View style={styles.headerTextLoader} />
      </View>
      <View style={styles.adCardLoader}>
        <ShimmerEffect />
      </View>

      {/* Popular Services Section Loader */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerAccentLoader} />
        <View style={styles.headerTextLoader} />
      </View>
      <View style={styles.servicesContainer}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.serviceCardLoader}>
            <View style={styles.serviceImageLoader}>
              <ShimmerEffect />
            </View>
            <View style={styles.serviceTextLoader}>
              <ShimmerEffect />
            </View>
            <View style={[styles.serviceTextLoader, { width: '60%' }]}>
              <ShimmerEffect />
            </View>
          </View>
        ))}
      </View>

      {/* Footer Buttons Loader */}
      <View style={styles.footerButtonsContainer}>
        <View style={styles.buttonLoader}>
          <ShimmerEffect />
        </View>
        <View style={styles.buttonLoader}>
          <ShimmerEffect />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerAccentLoader: {
    width: 4,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    borderRadius: 2,
  },
  headerTextLoader: {
    width: 120,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  adCardLoader: {
    width: AD_CARD_WIDTH,
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  serviceCardLoader: {
    width: (SCREEN_WIDTH - 50) / 2,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImageLoader: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  serviceTextLoader: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonLoader: {
    flex: 1,
    height: 45,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default HomeScreenLoader;