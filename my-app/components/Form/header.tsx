import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// check readme to know how to use this component
interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  backgroundColor = "#004D40",
  rightComponent
}) => {
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={[styles.headerContainer, { backgroundColor }]}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        {rightComponent && rightComponent}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  backButton: {
    marginBottom: 10,
  },
});

export default Header;