import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItem,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";

interface Business {
  id: number;
  name: string;
  imageUrl: string;
  rating: number;
}

interface AllBusinessesProps {
  navigation: NativeStackNavigationProp<any>;
}

const AllBusinesses: React.FC<AllBusinessesProps> = ({ navigation }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );

  const toggleModal = (businessId: number | null = null) => {
    setSelectedBusinessId(businessId);
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchBusinesses = async (page: number) => {
      setLoadingMore(true);
      const { data, error } = await supabase
        .from("business")
        .select("*")
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      if (error) {
        console.error("Error fetching businesses:", error);
      } else {
        setBusinesses((prev) => [...prev, ...data]);
      }
      setLoading(false);
      setLoadingMore(false);
    };

    fetchBusinesses(page);
  }, [page]);

  const loadMoreBusinesses = () => {
    if (!loadingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderStars = (rating: number): JSX.Element => (
    <View style={styles.ratingContainer}>
      <FontAwesome name="star" size={16} color="#FFD700" />
      <Text style={styles.ratingText}>{` ${rating.toFixed(1)}`}</Text>
    </View>
  );

  const renderItem: ListRenderItem<Business> = ({ item }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => toggleModal(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />
      <Text style={styles.businessName}>{item.name}</Text>
      {renderStars(item.rating || 0)}
      <TouchableOpacity style={styles.favoriteIcon}>
        <FontAwesome name="heart-o" size={24} color="#FF6347" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && businesses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>All Businesses</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose an option:</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  if (selectedBusinessId !== null) {
                    navigation.navigate("OneServices", {
                      businessId: selectedBusinessId,
                    });
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate("BusinessProfile");
                }}
              >
                <Text style={styles.modalButtonText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {businesses.length === 0 ? (
          <Text style={styles.noBusinessesText}>No businesses found.</Text>
        ) : (
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={loadMoreBusinesses}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
              ) : null
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllBusinesses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#00796B",
    textAlign: "center",
    marginTop: 20,
  },
  businessCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    flex: 1,
    maxWidth: "45%",
    alignItems: "center",
    position: "relative",
  },
  businessImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  noBusinessesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  loadingMoreContainer: {
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 16,
    color: "#00796B",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#00796B",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
