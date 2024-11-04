import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from "../../services/supabaseClient"; // Ensure supabaseClient is properly configured
import Header from '../../components/Form/header';

interface SetupOption {
  key: string;
  title: string;
  description: string;
  icon: string;
}

const setupOptions: SetupOption[] = [
  {
    key: 'disable_availability',
    title: 'Disable Availability',
    description: 'Temporarily disable service availability without deleting the service',
    icon: 'event-busy'
  },
  {
    key: 'disable_service',
    title: 'Disable Service',
    description: 'Completely disable the service from being viewed or booked',
    icon: 'block'
  },
  {
    key: 'accept_cash',
    title: 'Accept Cash',
    description: 'Allow cash payments for this service',
    icon: 'payments'
  },
  {
    key: 'accept_card',
    title: 'Accept Card',
    description: 'Allow card payments for this service',
    icon: 'credit-card'
  },
  {
    key: 'accept_online',
    title: 'Accept Online Payment',
    description: 'Allow online payments for this service',
    icon: 'language'
  },
  {
    key: 'accept_cheque',
    title: 'Accept Cheque',
    description: 'Allow cheque payments for this service',
    icon: 'receipt'
  },
  {
    key: 'accept_notification',
    title: 'Enable Notifications',
    description: 'Send notifications for bookings and updates',
    icon: 'notifications'
  },
  {
    key: 'accept_complaint',
    title: 'Accept Complaints',
    description: 'Allow customers to submit complaints',
    icon: 'feedback'
  },
  {
    key: 'accept_review',
    title: 'Accept Reviews',
    description: 'Allow customers to leave reviews',
    icon: 'star'
  }
];

const ServiceSetupScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { businessId, serviceId } = route.params;
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SetupOption | null>(null);

  const handleToggle = (option: SetupOption) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    if (selectedOption) {
      setSettings(prev => ({
        ...prev,
        [selectedOption.key]: !prev[selectedOption.key]
      }));
    }
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      await supabase
        .from('services')
        .update(settings)
        .eq('id', serviceId);

      navigation.navigate('ValidateServiceScreen', {
        businessId,
        serviceId,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Service Setup"
        subtitle="Configure service settings"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {setupOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.optionCard}
            onPress={() => handleToggle(option)}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Icon name={option.icon} size={24} color="#004D40" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </View>
            <Switch
              value={settings[option.key] || false}
              onValueChange={() => handleToggle(option)}
              trackColor={{ false: '#D1D1D1', true: '#80CBC4' }}
              thumbColor={settings[option.key] ? '#004D40' : '#f4f3f4'}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name={selectedOption?.icon || ''} size={40} color="#004D40" />
            <Text style={styles.modalTitle}>{selectedOption?.title}</Text>
            <Text style={styles.modalDescription}>{selectedOption?.description}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
    content: {
      flex: 1,
      padding: 20,
    },
    optionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E0F2F1',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
    },
    optionText: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#004D40',
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      color: '#666666',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#004D40',
      marginTop: 15,
      marginBottom: 10,
    },
    modalDescription: {
      fontSize: 16,
      color: '#666666',
      textAlign: 'center',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: '#F5F5F5',
    },
    confirmButton: {
      backgroundColor: '#004D40',
    },
    cancelButtonText: {
      color: '#004D40',
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonContainer: {
      padding: 20,
      paddingBottom: 30,
    },
    saveButton: {
      backgroundColor: '#004D40',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default ServiceSetupScreen;