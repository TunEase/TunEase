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
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  appName: {
    fontSize: 33,
    fontWeight: "bold",
    color: "#3572EF",
  },
  searchNotificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    width: "80%",
  },
  searchBar: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1565C0",
    borderRadius: 20,
    fontSize: 16,
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
  },
  notificationIcon: {
    marginLeft: 10,
  },
});
