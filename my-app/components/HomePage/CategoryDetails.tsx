import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  Dimensions,
  StatusBar 

} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
// import {Category} from "../../types/category"; 


const { width } = Dimensions.get('window');

interface CategoryDetailsProps {
  route: { params: { category: Category } };
  navigation: any;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  route,
  navigation,
}) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={category.gradient}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <FontAwesome5 
              name={category.icon} 
              size={32} 
              color="#FFF" 
            />
          </View>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <Text style={styles.headerDescription}>
            {category.description}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <View style={styles.servicesGrid}>
          {category.items.map((service, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.serviceCard}
              onPress={() => {/* Handle service selection */}}
            >
              <View style={styles.serviceIcon}>
                <FontAwesome5 
                  name="file-alt" 
                  size={24} 
                  color="#00796B" 
                />
              </View>
              <Text style={styles.serviceName}>{service}</Text>
              <Text style={styles.serviceDescription}>
                Click to view details and requirements
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  serviceCard: {
    width: (width - 55) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666666',
  },
});

export default CategoryDetails;