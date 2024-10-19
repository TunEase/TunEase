import React from "react";
import { View, Image, StyleSheet } from "react-native";

const MainImage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        // source={require("../../assets/city-view.jpg")}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});

export default MainImage;
