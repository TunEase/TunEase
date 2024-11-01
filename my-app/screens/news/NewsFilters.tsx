import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FILTERS = [
  { id: 'all', label: 'All Updates' },
  { id: 'OFFER', label: 'Offer' },
  { id: 'PROMOTION', label: 'Promotions' },
  { id: 'EVENT', label: 'Events' },
  { id: 'UPDATE', label: 'Update' },
];

interface NewsFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilter,
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    elevation: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeFilter: {
    backgroundColor: '#00796B',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
  },
});

export default NewsFilters;