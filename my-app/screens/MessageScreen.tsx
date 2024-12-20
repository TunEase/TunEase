import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MainFooter from "../components/HomePage/MainFooter"; // Import MainFooter

interface Conversation {
  id: string;
  name: string;
  created_at: string;
  avatar_url?: string;
}

const MessageScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string>("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchConversations();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user) {
      setAuthenticatedUserId(user.id);
      const { data, error } = await supabase
        .from("user_profile")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
      } else {
        setUserRole(data.role);
      }
    }
  };

  const fetchConversations = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    let query = supabase
      .from("conversations")
      .select(
        `
      id,
      created_at,
      user_profile: user_profile_id (
        id,
        name,
        media: media (
          media_url
        )
      ),
      business: business_id (
        id,
        name,
        media: media (
          media_url
        )
      )
    `
      )
      .or(`user_profile_id.eq.${user.id},business_id.eq.${user.id}`);

    const { data, error } = await query;
    console.log("conversations", data);
    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      const formattedData = data.map((conversation: any) => ({
        id: conversation.id,
        name: conversation.business?.name || "Unknown",
        avatar_url:
          conversation.business?.media?.[0]?.media_url || "default-avatar-url",
        created_at: conversation.created_at,
      }));
      setConversations(formattedData);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <FontAwesome5
          name="ellipsis-v"
          size={20}
          color="#333"
          style={styles.icon}
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        placeholderTextColor="#999"
      />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatRoomScreen", {
                conversationId: item.id,
                name: item.name,
                authenticatedUserId: authenticatedUserId,
              })
            }
          >
            <LinearGradient
              colors={["#FFF", "#F0F0F0"]}
              style={[
                styles.messageItem,
                {
                  backgroundColor: item.name === "Unknown" ? "#D3D3D3" : "#FFF",
                },
              ]}
            >
              <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <Text style={styles.name}>{item?.name || "Unknown"}</Text>
              </View>
              <View style={styles.messageMeta}>
                <Text style={styles.time}>5 min</Text>
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>2</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <MainFooter navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    marginHorizontal: 10,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    color: "#333",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  messageMeta: {
    alignItems: "flex-end",
  },
  time: {
    color: "#999",
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: "#00796B",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  unreadCount: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default MessageScreen;
