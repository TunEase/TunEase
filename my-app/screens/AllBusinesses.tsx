import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItem,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { Business } from "../types/business";

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
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleModal = (businessId: string | null = null) => {
    setSelectedBusinessId(businessId);
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchBusinesses = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    const { data: businessData, error: businessError } = await supabase
      .from("business")
      .select(
        `
        *,
        media:media(business_id, media_url),
        services:services(*, media:media(*), reviews:reviews(*, media:media(*), user_profile:user_profile(*))),
        reviews:reviews(*, media:media(*), user_profile:user_profile(*))
      `
      )
      .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

    if (businessError) {
      console.error("Error fetching businesses:", businessError);
    } else {
      setBusinesses((prevBusinesses) => [
        ...prevBusinesses,
        ...(businessData as Business[]),
      ]);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchBusinesses();
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
  const renderItem: ListRenderItem<Business> = ({ item }) => {
    const randomImageUrl =
      item.media[Math.floor(Math.random() * item.media.length)].media_url;

    // Safely access the rating
    const rating =
      item.reviews && item.reviews.length > 0 ? item.reviews[0].rating : 0; // Default to 0 if no reviews

    return (
      <TouchableOpacity
        style={styles.businessCard}
        onPress={() => toggleModal(item.id)}
      >
        <Image source={{ uri: randomImageUrl }} style={styles.businessImage} />
        <Text style={styles.businessName}>{item.name}</Text>
        <View style={styles.ratingAndFavoriteContainer}>
          {renderStars(rating)}
          <TouchableOpacity style={styles.favoriteIcon}>
            <FontAwesome name="heart-o" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      <FlatList
        data={filteredBusinesses}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id with index for uniqueness
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>All Businesses</Text>
            <View style={styles.searchContainer}>
              <FontAwesome
                name="search"
                size={20}
                color="#333"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search businesses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
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
                      if (selectedBusinessId !== null) {
                        const selectedBusiness = businesses.find(
                          (b) => b.id === selectedBusinessId
                        );
                        const coverImageUrl =
                          selectedBusiness?.media[
                            Math.floor(
                              Math.random() * selectedBusiness.media.length
                            )
                          ].media_url;
                        const profileImageUrl =
                          selectedBusiness?.media[
                            Math.floor(
                              Math.random() * selectedBusiness.media.length
                            )
                          ].media_url;
                        const services = selectedBusiness?.services || [];
                        navigation.navigate("staticBusinessProfile", {
                          selectedBusiness: selectedBusiness,
                        });
                      }
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
          </>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMoreBusinesses}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

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
    alignItems: "center",
    marginBottom: 10,
  },
  ratingAndFavoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  favoriteIcon: {
    marginLeft: 10,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  loadMoreButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  loadMoreText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AllBusinesses;