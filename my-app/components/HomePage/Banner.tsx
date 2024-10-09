import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.appName}>TunEase</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // Clean white background
    borderBottomWidth: 2,
    borderBottomColor: "#0D47A1", // Subtle blue line at the bottom of the header
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0D47A1", // Darker blue for the app name text
  },
  searchBar: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1565C0", // Medium blue border for the search bar
    borderRadius: 20,
    width: "90%",
    fontSize: 16,
    backgroundColor: "#E3F2FD", // Light blue background for the search bar
    color: "#0D47A1", // Dark blue text inside the search bar
  },
});
