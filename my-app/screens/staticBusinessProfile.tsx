// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Feather } from "@expo/vector-icons";
// const Profile = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.header}>
//           <Image
//             source={{ uri: "" }}
//             style={styles.backgroundImage}
//           />
//           <View style={styles.profileImageContainer}>
//             <Image
//               source={{ uri: "" }}
//               style={styles.profileImage}
//             />
//           </View>
//         </View>

//         <View style={styles.userInfo}>
//           <Text style={styles.userName}>Melissa Peters</Text>
//           <Text style={styles.userTitle}>Interior Designer</Text>
//           <View style={styles.locationContainer}>
//             <Feather name="map-pin" size={16} color="#4A0E4E" />
//             <Text style={styles.locationText}>Lagos, Nigeria</Text>
//           </View>
//         </View>

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>122</Text>
//             <Text style={styles.statLabel}>followers</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>67</Text>
//             <Text style={styles.statLabel}>following</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>37K</Text>
//             <Text style={styles.statLabel}>likes</Text>
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Edit profile</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Add friends</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.tabContainer}>
//           <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//             <Text style={[styles.tabText, styles.activeTabText]}>Photos</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.tab}>
//             <Text style={styles.tabText}>Likes</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.photosGrid}>
//           {[1, 2, 3, 4].map((item) => (
//             <Image
//               key={item}
//               source={{
//                 uri: ``,
//               }}
//               style={styles.gridImage}
//             />
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   header: {
//     height: 200,
//     position: "relative",
//   },
//   backgroundImage: {
//     width: "100%",
//     height: "100%",
//   },
//   profileImageContainer: {
//     position: "absolute",
//     bottom: -50,
//     alignSelf: "center",
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: "#FFFFFF",
//   },
//   userInfo: {
//     alignItems: "center",
//     marginTop: 60,
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#4A0E4E",
//   },
//   userTitle: {
//     fontSize: 16,
//     color: "#666666",
//     marginTop: 4,
//   },
//   locationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   locationText: {
//     marginLeft: 4,
//     color: "#666666",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   statItem: {
//     alignItems: "center",
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#4A0E4E",
//   },
//   statLabel: {
//     fontSize: 14,
//     color: "#666666",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: "#4A0E4E",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
//   tabContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEEEEE",
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#4A0E4E",
//   },
//   tabText: {
//     fontSize: 16,
//     color: "#666666",
//   },
//   activeTabText: {
//     color: "#4A0E4E",
//     fontWeight: "bold",
//   },
//   photosGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     padding: 5,
//   },
//   gridImage: {
//     width: "50%",
//     aspectRatio: 1,
//     padding: 5,
//   },
// });
// export default Profile;
