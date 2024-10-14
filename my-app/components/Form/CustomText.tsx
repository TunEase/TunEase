import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type CustomTextProps = {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'title' | 'body' | 'caption';
};

const CustomText: React.FC<CustomTextProps> = ({ children, style, variant = 'body' }) => {
  return <Text style={[styles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    fontSize: 16,
    color: '#555',
  },
  caption: {
    fontSize: 12,
    color: '#888',
  },
});

export default CustomText;
