import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../services/supabaseClient";
import * as Animatable from "react-native-animatable";

type Complaint = {
  id: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at?: string;
  resolution_note?: string;
  user_name: string;
  user_email: string;
  user_image_url?: string;
};

const OwnerComplaintsScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { serviceId } = route.params;
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [rejectedAnimationVisible, setRejectedAnimationVisible] =
    useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select(
          `
          id,
          description,
          status,
          created_at,
          resolved_at,
          resolution_note,
          user_profile!complaints_complainant_id_fkey (
            name,
            email
          ),
          media:media!complaint_id (
            media_url
          )
        `
        )
        .eq("service_id", serviceId)
        .eq("media.media_type", "image");

      if (error) {
        console.error("Error fetching complaints:", error);
      } else {
        const formattedData = data.map((complaint: any) => ({
          ...complaint,
          user_name: complaint.user_profile.name,
          user_email: complaint.user_profile.email,
          user_image_url: complaint.media ? complaint.media.media_url : null,
        }));
        setComplaints(formattedData);
      }
    };

    fetchComplaints();
  }, [serviceId]);

  const handleReject = async (complaintId: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status: "DISMISSED" })
      .eq("id", complaintId);

    if (error) {
      Alert.alert("Error", "Failed to reject the complaint.");
    } else {
      setRejectedAnimationVisible(true);
      setTimeout(() => setRejectedAnimationVisible(false), 2000);
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: "DISMISSED" }
            : complaint
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complaints</Text>
      <SwipeListView
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.complaintItem}>
            {item.user_image_url && (
              <Image
                source={{ uri: item.user_image_url }}
                style={styles.userImage}
              />
            )}
            <Text style={styles.userName}>{item.user_name}</Text>
            <Text style={styles.complaintText}>{item.description}</Text>
            <Text
              style={[
                styles.complaintStatus,
                item.status === "DISMISSED" && styles.dismissedStatus,
              ]}
            >
              Status: {item.status}
            </Text>
            <Text style={styles.complaintDate}>
              Created At: {item.created_at}
            </Text>
            {item.resolved_at && (
              <Text style={styles.complaintResolved}>
                Resolved At: {item.resolved_at}
              </Text>
            )}
            {item.resolution_note && (
              <Text style={styles.complaintNote}>
                Note: {item.resolution_note}
              </Text>
            )}
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <View style={styles.iconContainer}>
              <Icon
                name="close"
                size={30}
                color="#FFF"
                onPress={() => handleReject(item.id)}
              />
              <Text style={styles.iconText}>Reject</Text>
            </View>
            <View style={styles.iconContainerBlue}>
              <Icon
                name="reply"
                size={30}
                color="#FFF"
                onPress={() =>
                  navigation.navigate("ReplyToComplaintScreen", {
                    complaintId: item.id,
                    description: item.description,
                    created_at: item.created_at,
                  })
                }
              />
              <Text style={styles.iconText}>Reply</Text>
            </View>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
      {rejectedAnimationVisible && (
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={styles.rejectedAnimation}
        >
          <Text style={styles.rejectedAnimationText}>Rejected!</Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  complaintItem: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  complaintText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
  },
  complaintStatus: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  dismissedStatus: {
    color: "#FF3B30",
  },
  complaintDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  complaintResolved: {
    fontSize: 12,
    color: "#4CAF50",
    marginBottom: 4,
  },
  complaintNote: {
    fontSize: 12,
    color: "#FF9800",
    marginBottom: 4,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: "100%",
    backgroundColor: "#FF3B30",
    borderRadius: 12,
  },
  iconContainerBlue: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: "100%",
    backgroundColor: "#007BFF",
    borderRadius: 12,
  },
  iconText: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 5,
  },
  rejectedAnimation: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  rejectedAnimationText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default OwnerComplaintsScreen;
