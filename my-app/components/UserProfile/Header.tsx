import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, LogOut } from "lucide-react-native";

const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogout}>
        <LogOut color="#000" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
});

export default Header;
