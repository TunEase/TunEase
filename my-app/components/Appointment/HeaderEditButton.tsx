import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderEditButtonProps {
  isEditMode: boolean;
  onPress: () => void;
}

const HeaderEditButton = ({ isEditMode, onPress }: HeaderEditButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons 
      name={isEditMode ? "checkmark" : "create-outline"} 
      size={24} 
      color="#fff" 
    />
  </TouchableOpacity>
);

export default HeaderEditButton;