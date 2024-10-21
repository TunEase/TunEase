import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import BusinessProfileApp from "../screens/BusinessProfileApp";
import { supabase } from "../services/supabaseClient";

interface BusinessProfileContainerProps {
  name: string;
  description: string;
  navigation: any;
  contact: {
    id: string;
    email: string;
    phone: string;
    address: string;
  };
  imageUrl: string;
}
const BusinessProfileContainer: React.FC<BusinessProfileContainerProps> = ({
  navigation,
}) => {
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const { data, error } = await supabase
        .from("business")
        .select("*")
        .eq("id", "business_id")
        .single();

      if (error) {
        console.error("Error fetching business profile:", error);
      } else {
        setBusinessProfile(data);
      }
      setLoading(false);
    };

    fetchBusinessProfile();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!businessProfile) {
    return <Text>No business profile found.</Text>;
  }

  return (
    <BusinessProfileApp
      name={businessProfile.name}
      description={businessProfile.description}
      navigation={navigation}
      contact={{
        id: businessProfile.id,
        email: businessProfile.email,
        phone: businessProfile.phone,
        address: businessProfile.address,
      }}
      imageUrl={businessProfile.imageUrl}
    />
  );
};

export default BusinessProfileContainer;
