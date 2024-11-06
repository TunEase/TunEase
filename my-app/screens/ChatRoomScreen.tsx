import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation
import { supabase } from "../services/supabaseClient";
import { ResizeMode, Video } from "expo-av";
import { useSendMessage } from "../hooks/useSendMesage";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  media?: { media_url: string; media_type: string }[];
}

const ChatRoomScreen: React.FC = () => {
  const navigation = useNavigation(); // Initialize the navigation hook
  const route = useRoute();
  const { conversationId, businessName, authenticatedUserId } =
    route.params as {
      conversationId: string;
      businessName: string;
      authenticatedUserId: string;
    };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    loading,
    sendMessage,
    error: sendError,
  } = useSendMessage(conversationId, authenticatedUserId);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        "*,user_profile(name,media(media_url, media_type)), media:media!media_message_id_fkey(media_url, media_type)"
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false }); // Order by created_at descending

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage("");
      fetchMessages(); // Refresh messages after sending
    }
  };

  const handleMediaUpload = async (mediaType: "image" | "video") => {
    await sendMessage("", mediaType);
    fetchMessages(); // Refresh messages after uploading
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSentByUser = item.sender_id === authenticatedUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isSentByUser ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByUser ? styles.sentText : styles.receivedText,
            ]}
          >
            {item.content}
          </Text>
          {item.media &&
            item.media.map((mediaItem) =>
              mediaItem.media_type === "image" ? (
                <Image
                  key={mediaItem.media_url}
                  source={{ uri: mediaItem.media_url }}
                  style={styles.mediaImage}
                />
              ) : (
                <Video
                  key={mediaItem.media_url}
                  source={{ uri: mediaItem.media_url }}
                  style={styles.mediaVideo}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                />
              )
            )}
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{businessName}</Text>
        <TouchableOpacity>
          <FontAwesome name="info-circle" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        inverted // Invert the list to show the latest messages at the bottom
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleMediaUpload("image")}
        >
          <FontAwesome name="image" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleMediaUpload("video")}
        >
          <FontAwesome name="video-camera" size={20} color="#FFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <FontAwesome name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
      {sendError && <Text style={{ color: "red" }}>{sendError}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sentMessage: {
    justifyContent: "flex-end",
  },
  receivedMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
  },
  sentBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  receivedBubble: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  sentText: {
    color: "#333",
  },
  receivedText: {
    color: "#333",
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  mediaVideo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 30,
    margin: 10,
  },
  addButton: {
    backgroundColor: "#00796B",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#00796B",
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatRoomScreen;
