import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName =
  | 'add'
  | 'alarm'
  | 'arrow-back'
  | 'arrow-forward'
  | 'checkmark'
  | 'home'
  | 'information-circle'
  | 'lock-closed'
  | 'mail'
  | 'person'
  // ... add other icon names you plan to use

type IconInputProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: IoniconsName; // Update this line
  secureTextEntry?: boolean;
};

const IconInput: React.FC<IconInputProps> = ({  label, placeholder, value, onChangeText, icon, secureTextEntry = false  }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#888"
        />
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});

export default IconInput;
