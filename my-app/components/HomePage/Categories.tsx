import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7;

interface CategoriesProps {
  navigation: any;
}

const categories = [
  {
    title: "Baladia",
    icon: "landmark",
    gradient: ['#FF6B6B', '#FF8E8E'],
    description: "Municipal services and administrative documents",
    items: ["Madhmoun", "Rokhsa Bine", "Ta3rif bel imdha"]
  },
  {
    title: "Bousta",
    icon: "envelope",
    gradient: ['#4FACFE', '#00F2FE'],
    description: "Postal services and money transfers",
    items: ["chahria", "manda"]
  },
  {
    title: "Markez",
    icon: "building",
    gradient: ['#43E97B', '#38F9D7'],
    description: "Identity documents and official papers",
    items: ["bita9t ta3rif", "passport"]
  },
  {
    title: "Kbadha",
    icon: "landmark",
    gradient: ['#FA709A', '#FEE140'],
    description: "Payment and financial services",
    items: ["tenbri", "tranfert flous"]
  }
];

const Categories: React.FC<CategoriesProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>What are you looking for?</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={cardWidth + 20}
      >
        {categories.map((category, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            onPress={() => navigation.navigate("CategoryDetails", { category: category.title })}
          >
            <LinearGradient
              colors={category.gradient}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name={category.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.cardTitle}>{category.title}</Text>
                <Text style={styles.cardDescription}>{category.description}</Text>
                <View style={styles.itemsContainer}>
                  {category.items.map((item, index) => (
                    <View key={index} style={styles.itemChip}>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    color: '#1A1A1A',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: cardWidth,
    height: 280,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 14,
  }
});

export default Categories;