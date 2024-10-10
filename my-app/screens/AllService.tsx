import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const services = [
  { id: '1', name: 'Electrician', icon: 'flash' },
  { id: '2', name: 'AC repair', icon: 'air-conditioner' },
  { id: '3', name: 'Cleaning', icon: 'broom' },
  { id: '4', name: 'Cooking', icon: 'chef-hat' },
  { id: '5', name: 'Gardening', icon: 'flower' },
  { id: '6', name: 'Laundry', icon: 'washing-machine' },
  { id: '7', name: 'Pest control', icon: 'spray' },
  { id: '8', name: 'Salon', icon: 'scissors-cutting' },
  { id: '9', name: 'Painting', icon: 'brush' },
  { id: '10', name: 'Plumber', icon: 'water-pump' },
];

const ServiceScreen = () => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.serviceItem}>
      <Icon name={item.icon} size={40} color="#4A90E2" />
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  row: {
    justifyContent: 'space-between',
  },
  serviceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  serviceText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333333',
  },
});

export default ServiceScreen;
