import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const Signup = () => {
  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button title="Signup" onPress={() => {}} />
    </View>
  );
};
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Signup;
