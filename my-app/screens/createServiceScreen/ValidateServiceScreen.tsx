import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../services/supabaseClient';
import Header from '../../components/Form/header';
import ConfirmationModal from '../../components/StatusComponents/ConfirmationModal';
import SuccessScreen from '../SuccessScreen';
interface ServiceDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  media: { media_url: string }[];
  disable_availability: boolean;
  disable_service: boolean;
  accept_cash: boolean;
  accept_card: boolean;
  accept_online: boolean;
  accept_cheque: boolean;
  accept_notification: boolean;
  accept_complaint: boolean;
  accept_review: boolean;
}

const ValidateServiceScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { businessId, serviceId } = route.params;
  console.log(businessId, serviceId);
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          media (media_url)
        `)
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch service details',error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      
      setShowSuccessScreen(true);
    } catch (error) {
      setError('Failed to confirm service');
    }
  };


  const deleteService = async () => {
    setDeleting(true);
    try {
      if (service?.media) {
        for (const media of service.media) {
          const mediaPath = media.media_url.split('/').pop();
          await supabase.storage
            .from('service-media')
            .remove([mediaPath as string]);
        }
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      console.log(error);
      if (error) throw error;
      navigation.navigate('BusinessProfile', { businessId });
    } catch (error) {
      setError('Failed to delete service');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };
  const renderSettings = () => {
    const settings = [
      { key: 'disable_availability', icon: 'event-busy' },
      { key: 'disable_service', icon: 'block' },
      { key: 'accept_cash', icon: 'payments' },
      { key: 'accept_card', icon: 'credit-card' },
      { key: 'accept_online', icon: 'language' },
      { key: 'accept_cheque', icon: 'receipt' },
      { key: 'accept_notification', icon: 'notifications' },
      { key: 'accept_complaint', icon: 'feedback' },
      { key: 'accept_review', icon: 'star' }
    ];

    return settings.map(({ key, icon }) => (
      <View key={key} style={styles.settingRow}>
        <Icon
          name={icon}
          size={24}
          color={service?.[key] ? '#004D40' : '#CCCCCC'}
        />
        <Text style={styles.settingText}>
          {key.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Text>
      </View>
    ));
  };

  if (showSuccessScreen) {
    return (
      <SuccessScreen
        title="Service Created Successfully!"
        description="Your service has been created and is now available for booking."
        primaryButtonText="Go to Business Profile"
        secondaryButtonText="Create Another Service"
        primaryNavigateTo="BusinessProfile"
        secondaryNavigateTo="CreateService"
        primaryParams={{ businessId }}
        secondaryParams={{ businessId }}
      />
    );
  }
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004D40" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Review Service"
        subtitle="Confirm your service details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{service?.name}</Text>
            
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{service?.description}</Text>
            
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>${service?.price}</Text>
            
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{service?.duration} minutes</Text>
          </View>
        </View>

        {service?.media && service.media.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {service.media.map((media, index) => (
                <Image
                  key={index}
                  source={{ uri: media.media_url }}
                  style={styles.mediaPreview}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            {renderSettings()}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => setShowDeleteModal(true)}
          disabled={deleting}
        >
          <Icon name="delete-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Delete Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
          disabled={deleting}
        >
          <Icon name="check" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Confirm Service</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        icon="delete-forever"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={deleteService}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        confirmButtonColor="#D32F2F"
      />

      <ConfirmationModal
        visible={!!error}
        title="Error"
        description={error || ''}
        icon="error"
        onCancel={() => setError(null)}
        onConfirm={() => setError(null)}
        confirmText="OK"
        cancelText="Try Again"
        confirmButtonColor="#D32F2F"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
    marginBottom: 10,
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  confirmButton: {
    backgroundColor: '#004D40',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ValidateServiceScreen;
