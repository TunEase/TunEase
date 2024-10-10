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
      <View style={styles.searchNotificationContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholderTextColor="#A7A9BE"
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#F2F2F2",
    borderBottomWidth: 1,
    borderBottomColor: "#B0BEC5",
    elevation: 3,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#00796B",
  },
  searchNotificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: "90%",
  },
  searchBar: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: "#E8F5E9",
    color: "#004D40",
  },
});
