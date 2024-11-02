export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  address: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  media: Media[];
  services: Service[];
  reviews: Review[];
  category: string; // Add this line
  location: string;
}
export interface User_profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  role: string;
  media: Media[];
}
export interface Media {
  id: string;
  service_id?: string;
  complaint_id?: string;
  review_id?: string;
  business_id?: string;
  media_url: string;
  media_type: string;
  created_at: string;
}
export interface Service {
  id: string;
  name: string;
  description: string;
  reviews: Review[];
  media: Media[];
  price: number;
  business?: Business;
  eligibility: string;
  fees: string;
}

export interface Review {
  id: string;
  rating: number;
  business_id?: string;
  user_profile_id?: string;
  comment: string;
  media: Media[];
  user_profile: User_profile;
}

export type RootStackParamList = {
  selectedBusiness: {
    selectedBusiness: Business;
    ServiceDetails: { serviceId: string };
  };
};
