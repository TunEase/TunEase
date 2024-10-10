import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#42A5F5", // Added background color for better visibility
    borderRadius: 25,
    paddingVertical: 10, // Added vertical padding for a better touch target
    paddingHorizontal: 20, // Added horizontal padding for better text spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Slight adjustment for shadow effect
    shadowOpacity: 0.1, // Added shadow opacity for a softer look
    shadowRadius: 3, // Added shadow radius for a subtle shadow
    elevation: 2, // Added elevation for Android devices
  },
  buttonText: {
    fontSize: 16, // Increased font size for better readability
    color: "#FFFFFF",
    fontWeight: "600", // Increased font weight for emphasis
    textAlign: "center",
  },
});

export default ButtonStyles;
