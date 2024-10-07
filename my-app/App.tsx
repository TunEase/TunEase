import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";

export default function App() {
  return (
    <View style={styles.container}>
      <Login />
      <Signup />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
