import { createStackNavigator } from "@react-navigation/stack";
import CategoryDetails from "./components/HomePage/CategoryDetails";
import Home from "./screens/HomePage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomePage" component={Home} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigator;