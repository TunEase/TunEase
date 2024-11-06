import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { 
  RenderItemParams,
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '../../types/Appointment';

interface AppointmentContentProps {
  appointments: Appointment[];
  isLoading: boolean;
  isEditMode: boolean;
  userRole: string | null;
  onCancelAppointment: (id: string, date: string, time: string) => void;
  canCancelAppointment: (date: string, time: string) => boolean;
  onReorderComplete: (reorderedAppointments: Appointment[]) => Promise<void>;
  navigation: any;
}

const AppointmentContent = ({
  appointments,
  isLoading,
  isEditMode,
  userRole,
  onCancelAppointment,
  canCancelAppointment,
  onReorderComplete,
  navigation
}: AppointmentContentProps) => {
  const [localAppointments, setLocalAppointments] = useState(appointments);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#00796B" />
      <Text style={styles.emptyText}>No appointments found</Text>
      <Text style={styles.emptySubText}>Your upcoming appointments will appear here</Text>
    </View>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Appointment>) => (
    <ScaleDecorator>
      <AppointmentCard
        item={item}
        isEditMode={isEditMode}
        isDragging={isActive}
        onCancel={userRole === 'BUSINESS_MANAGER' ? onCancelAppointment : undefined}
        canCancel={canCancelAppointment}
        onDragStart={drag}
      />
    </ScaleDecorator>
  );

  const handleDragEnd = async ({ data }: { data: Appointment[] }) => {
    setLocalAppointments(data);
    if (onReorderComplete) {
      await onReorderComplete(data);
    }
  };

  return (
    <View style={styles.container}>
      {localAppointments.length === 0 ? renderEmptyState() : (
        <DraggableFlatList
          data={localAppointments}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          enabled={isEditMode}
          containerStyle={styles.listContainer}
          contentContainerStyle={[
            styles.listContent,
            userRole === 'BUSINESS_MANAGER' && !isEditMode && styles.listWithButtons
          ]}
        />
      )}

      {userRole === 'BUSINESS_MANAGER' && !isEditMode && (
        <ReorderingButtons navigation={navigation} />
      )}
    </View>
  );
};

const ReorderingButtons = ({ navigation }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity 
      style={styles.reorderButton} 
      onPress={() => navigation.navigate("AutoReorderingScreen")}
    >
      <Ionicons name="flash-outline" size={24} color="#FFFFFF" />
      <Text style={styles.reorderButtonText}>Auto Reorder</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.reorderButton} 
      onPress={() => navigation.navigate("CustomReorderingScreen")}
    >
      <Ionicons name="list-outline" size={24} color="#FFFFFF" />
      <Text style={styles.reorderButtonText}>Custom Reorder</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  listWithButtons: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 5,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    elevation: 2,
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AppointmentContent;