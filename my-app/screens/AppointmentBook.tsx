import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import DraggableFlatList, { 
  RenderItemParams,
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import AppointmentCard from '../components/Appointment/AppointmentCard';
import { Appointment } from '../types/Appointment';

interface AppointmentContentProps {
  appointments: Appointment[];
  isLoading: boolean;
  isEditMode: boolean;
  userRole: string | null;
  onRefresh: () => void;
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
  onRefresh,
  onCancelAppointment,
  canCancelAppointment,
  onReorderComplete,
  navigation
}: AppointmentContentProps) => {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalAppointments(appointments);
    }
  }, [appointments, isDragging]);

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

  const handleDragBegin = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async ({ data }: { data: Appointment[] }) => {
    setIsDragging(false);
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
          onDragBegin={handleDragBegin}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          enabled={isEditMode}
          containerStyle={styles.listContainer}
          contentContainerStyle={[
            styles.listContent,
            userRole === 'BUSINESS_MANAGER' && !isEditMode && styles.listWithButtons
          ]}
          refreshing={isLoading && !isDragging}
          onRefresh={!isDragging ? onRefresh : undefined}
        />
      )}

      {userRole === 'BUSINESS_MANAGER' && !isEditMode && (
        <ReorderingButtons navigation={navigation} />
      )}
    </View>
  );
};

export default AppointmentContent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: "#00796B",
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: "#00796B",
  },
  listWithButtons: {
    paddingBottom: 100,
  },

  serviceContainer: {
    paddingTop: 20,
  },
  calendarButton: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    marginLeft: 20,
    padding: 10,
    borderRadius: 15,
  },
  calendarText: {
    fontSize: 18,
    color: "#00796B",
    marginRight: 150,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalClose: {
    alignSelf: "flex-end",
  },
  bookingCardWrapper: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  seeAllText: {
    textAlign: "center",
    color: "#00796B",
    fontSize: 16,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#00796B",
    fontWeight: "bold",
    marginBottom: 15,
  },
});
