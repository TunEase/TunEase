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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  searchBar: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "90%",
    fontSize: 16,
  },
});
﻿
