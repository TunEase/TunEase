import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

type TextFieldProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: object;
  secureTextEntry?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({ label, placeholder, value, onChangeText, style, secureTextEntry = false }) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default TextField;
