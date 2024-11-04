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
      await supabase
        .from('services')
        .update({ status: 'active' })
        .eq('id', serviceId);

      Alert.alert(
        'Success',
        'Service has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BusinessProfile', { businessId })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm service');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteService
        }
      ]
    );
  };

  const deleteService = async () => {
    setDeleting(true);
    try {
      // Delete media files from storage
      if (service?.media) {
        for (const media of service.media) {
          const mediaPath = media.media_url.split('/').pop();
          await supabase.storage
            .from('service-media')
            .remove([mediaPath as string]);
        }
      }

      // Delete service record
      await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      navigation.navigate('BusinessProfile', { businessId });
    } catch (error) {
      Alert.alert('Error', 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

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
        {/* Service Basic Info */}
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

        {/* Media Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {service?.media.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.media_url }}
                style={styles.mediaPreview}
              />
            ))}
          </ScrollView>
        </View>

        {/* Service Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Settings</Text>
          <View style={styles.settingsCard}>
            {Object.entries(service || {})
              .filter(([key]) => key.startsWith('accept_') || key.startsWith('disable_'))
              .map(([key, value]) => (
                <View key={key} style={styles.settingRow}>
                  <Icon
                    name={value ? 'check-circle' : 'cancel'}
                    size={24}
                    color={value ? '#004D40' : '#B0BEC5'}
                  />
                  <Text style={styles.settingText}>
                    {key.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
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
